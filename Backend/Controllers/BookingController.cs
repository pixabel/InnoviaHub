using InnoviaHub.Models;
using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Data;
using InnoviaHub.Hubs;
using Microsoft.AspNetCore.SignalR;
using InnoviaHub.DTOs;
using Microsoft.EntityFrameworkCore;


namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly InnoviaHubDB _context;
        private readonly BookingService _bookingService;
        private readonly IHubContext<BookingHub> _hubContext;
        private readonly ILogger<BookingController> _logger;



        public BookingController(InnoviaHubDB context, BookingService bookingService, IHubContext<BookingHub> hubContext, ILogger<BookingController> logger)
        {
            _context = context;
            _bookingService = bookingService;
            _hubContext = hubContext;
            _logger = logger;

        }


        // GET api/bookings
        [HttpGet]
        public ActionResult<IEnumerable<Booking>> GetBookings()
        {
            return _bookingService.GetAllBookings();
        }

        [HttpGet("user/{userId}")]
        public ActionResult<List<Booking>> GetBookingsByUser(string userId)
        {
            var bookings = _bookingService.GetBookingsByUser(userId);
            return Ok(bookings);
        }

        // POST api
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking([FromBody] CreateBookingDTO dto)
        {
            Console.WriteLine($"POST Booking: ResourceId={dto.ResourceId}, UserId={dto.UserId}, Start={dto.StartTime}, End={dto.EndTime}");

            if (!ModelState.IsValid)
            {
                foreach (var kvp in ModelState)
                {
                    var field = kvp.Key;
                    foreach (var error in kvp.Value.Errors)
                    {
                        Console.WriteLine($"Model error on '{field}': {error.ErrorMessage}");
                    }
                }

                return BadRequest(ModelState);
            }

            TimeZoneInfo swedishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");

            var startTimeInSweden = TimeZoneInfo.ConvertTime(dto.StartTime, swedishTimeZone);
            var endTimeInSweden = TimeZoneInfo.ConvertTime(dto.EndTime, swedishTimeZone);

            // Control overlapping
            if (!_bookingService.IsBookingAvailable(dto.ResourceId, startTimeInSweden, endTimeInSweden))
                return Conflict("Booking overlaps with an existing one.");

            var nowInSweden = TimeZoneInfo.ConvertTime(DateTime.Now, swedishTimeZone);
            if (startTimeInSweden < nowInSweden)
                return BadRequest("Start time must be in the future.");

            // Create booking
            var booking = new Booking
            {
                UserId = dto.UserId,
                ResourceId = dto.ResourceId,
                BookingType = dto.BookingType,
                StartTime = dto.StartTime.ToUniversalTime(),
                EndTime = dto.EndTime.ToUniversalTime(),
                DateOfBooking = DateTime.Now
            };


            _bookingService.CreateBooking(booking);
            Console.WriteLine("📡 Sending SignalR update...");
            await _hubContext.Clients.All.SendAsync("ReceiveBookingUpdate", new BookingUpdate
            {
                ResourceId = booking.ResourceId,
                Date = booking.StartTime.ToString("yyyy-MM-dd")
            });

            return Ok(booking);
        }


        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = _bookingService.GetAllBookings().FirstOrDefault(b => b.BookingId == id);
            if (booking == null)
                return NotFound();

            if (!_bookingService.DeleteBooking(id))
                return NotFound();

            // To update with signalR when deleteBooking
            await _hubContext.Clients.All.SendAsync("ReceiveBookingUpdate", new BookingUpdate
            {
                ResourceId = booking.ResourceId,
                Date = booking.StartTime.ToString("yyyy-MM-dd")
            });

            return NoContent();

        }

        // PUT 
        [HttpPut("{id}")]
        public IActionResult UpdateBooking(int id, [FromBody] Booking booking)
        {
            if (!_bookingService.UpdateBooking(id, booking))
                return NotFound();

            return NoContent();
        }

        [HttpGet("ResourceAvailability")]
        public ActionResult GetResourceAvailability()
        {
            Console.WriteLine("DEBUG: Entering ResourceAvailability");

            try
            {
                TimeZoneInfo swedishTimeZone;
                try
                {
                    // Prefer IANA name first then Windows fallback
                    swedishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Stockholm");
                }
                catch
                {
                    try
                    {
                        swedishTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
                    }
                    catch (Exception tzEx)
                    {
                        Console.WriteLine("DEBUG: TimeZone lookup failed: " + tzEx);
                        return StatusCode(500, "Could not find the Swedish time zone on this system.");
                    }
                }

                var nowInSweden = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, swedishTimeZone);
                Console.WriteLine($"DEBUG: nowInSweden = {nowInSweden} (Kind={nowInSweden.Kind})");

                // load resources and timeslots into memory and log counts
                var resources = _context.Resources
                    .Include(r => r.Timeslots)
                    .ToList();

                Console.WriteLine($"DEBUG: resources loaded: count={resources.Count}");

                // We'll build availability and log progress
                var availability = new Dictionary<string,int>();
                foreach (var r in resources)
                {
                    try
                    {
                        // perform booking check with explicit UTC comparison to avoid kind issues
                        // assume bookings stored in UTC (they appear to be saved as ToUniversalTime())
                        var nowUtc = DateTime.UtcNow;

                        // Count bookings for this resource that overlap 'nowUtc'
                        var isBookedNow = _context.Bookings.Any(b =>
                            b.ResourceId == r.ResourceId &&
                            b.StartTime <= nowUtc &&
                            b.EndTime > nowUtc
                        );

                        var key = (r.ResourceType != null) ? r.ResourceType.ToString() : "Unknown";
                        if (!availability.ContainsKey(key)) availability[key] = 0;
                        if (!isBookedNow) availability[key] += 1;
                    }
                    catch (Exception perResourceEx)
                    {
                        Console.WriteLine("DEBUG: exception checking bookings for resource " + r.ResourceId + ": " + perResourceEx);
                        throw; // let outer catch handle and return details
                    }
                }

                Console.WriteLine($"DEBUG: availability computed: {System.Text.Json.JsonSerializer.Serialize(availability)}");
                return Ok(availability);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ResourceAvailability failed");
                Console.WriteLine("DEBUG ResourceAvailability exception:");
                Console.WriteLine(ex.ToString());

                return new ContentResult
                {
                    Content = ex.ToString(),
                    ContentType = "text/plain",
                    StatusCode = 500
                };
            }


        }
    }
}