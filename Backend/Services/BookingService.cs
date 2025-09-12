using Backend.Data;
using InnoviaHub.Models;

namespace Backend.Services;

public class BookingService
{
    private readonly InnoviaHubDB _context;

    public BookingService(InnoviaHubDB context)
    {
        _context = context;
    }

   // Creates a new booking and saves it to the database.
    public Booking CreateBooking(Booking booking)
    {

        if (string.IsNullOrEmpty(booking.UserId))
            throw new ArgumentException("UserId must be provided when creating a booking.");

        booking.DateOfBooking = DateTime.Now;
        
                _context.Booking.Add(booking);
        _context.SaveChanges();

        return booking;
    }

    // Gets all bookings for a specific user.
    public List<Booking> GetBookingsByUser(string userId)
    {
        return _context.Booking
            .Where(b => b.UserId == userId)
            .ToList();

    }

    // Checks if a booking is available for the given resource and time range.
    // Returns true if no overlap exists, otherwise false.
    public bool IsBookingAvailable(int resourceId, DateTime startTime, DateTime endTime)
    {
        return !_context.Booking.Any(b =>
             b.ResourceId == resourceId &&
             startTime < b.EndTime &&
             endTime > b.StartTime);

    }

    // Checks if an identical booking already exists.
    public bool ExistingBookings(int bookingId, int resourceId, DateTime startTime, DateTime endTime)
    {
        return _context.Booking.Any(b =>
            b.BookingId == bookingId &&
            b.ResourceId == resourceId &&
            b.StartTime == startTime &&
            b.EndTime == endTime);
    }

    // Checks if a booking was successfully added.
    public bool IsBookingAdded(int bookingId, DateTime startTime, DateTime endTime, int resourceId)
    {
        return ExistingBookings(bookingId, resourceId, startTime, endTime);
    }

    // Checks if there is any overlap with existing bookings for the given resource.
    public bool IsBookingOverlapping(int resourceId, DateTime startTime, DateTime endTime)
    {
        return _context.Booking.Any(b =>
            b.ResourceId == resourceId &&
            startTime < b.EndTime &&
            endTime > b.StartTime);
    }

    // Gets all bookings in the system.
    public List<Booking> GetAllBookings()
    {
        return _context.Booking.ToList();
    }

    // Updates an existing booking. Returns true if successful, false if not found.
    public bool UpdateBooking(int id, Booking updatedBooking)
    {
         var existingBooking = _context.Booking.FirstOrDefault(b => b.BookingId == id);
        if (existingBooking == null)
            return false;

        existingBooking.UserId = updatedBooking.UserId;
        existingBooking.ResourceId = updatedBooking.ResourceId;
        existingBooking.StartTime = updatedBooking.StartTime;
        existingBooking.EndTime = updatedBooking.EndTime;
        existingBooking.BookingType = updatedBooking.BookingType;

        _context.SaveChanges();
        return true;
    }

    // Deletes a booking by its ID. Returns true if successful, false if not found.
    public bool DeleteBooking(int bookingId)
    {
        var booking = _context.Booking.FirstOrDefault(b => b.BookingId == bookingId);
        if (booking == null)
            return false;

        _context.Booking.Remove(booking);
        _context.SaveChanges();
        return true;

    }
}
