using InnoviaHub.Models;
using Microsoft.AspNetCore.Mvc;
using InnoviaHub.Data;
using Backend.Services;


namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly BookingService _bookingService;

        public BookingController(AppDbContext context, BookingService bookingService)
        {
            _context = context;
            _bookingService = bookingService;
        }


        // GET api/bookings
        [HttpGet]
        public ActionResult<IEnumerable<Booking>> GetBookings()
        {
            return _bookingService.GetAllBookings();
        }

        // POST api
        [HttpPost]
        public ActionResult<Booking> CreateBooking(Booking booking)
        {
            if (!_bookingService.IsBookingAvailable(booking.ResourceId, booking.StartTime, booking.EndTime))
                return Conflict("Booking overlaps with an existing one.");

            _bookingService.CreateBooking(booking);
            return Ok(booking);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult DeleteBooking(int id)
        {
            if (!_bookingService.DeleteBooking(id))
                return NotFound();

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
        

    }
}