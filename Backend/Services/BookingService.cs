using InnoviaHub.Models;

namespace Backend.Services;

public class BookingService
{
    private List<Booking> bookings = new List<Booking>();

    // Sends one object instead of 5 separate values
    public Booking CreateBooking(Booking booking)
    {
        // Create new id if not recieved from frontend
        booking.BookingId = bookings.Count == 0 ? 1 : bookings.Max(b => b.BookingId) + 1;

        // Make sure userId exists
        if (string.IsNullOrEmpty(booking.UserId))
            throw new ArgumentException("UserId must be provided when creating a booking.");

        // set booking date/time
        booking.DateOfBooking = DateTime.Now;
        // add booking to list
        bookings.Add(booking);
        return booking;
    }

    public List<Booking> GetBookingsByUser(string userId)
    {
        return bookings.Where(b => b.UserId == userId).ToList();
    }

    public bool IsBookingAvailable(int resourceId, DateTime startTime, DateTime endTime)
    {
        var bookingForResource = bookings.Where(b => b.ResourceId == resourceId);
        var bookingsOverlap = bookingForResource.Any(b => startTime < b.EndTime && endTime > b.StartTime);
        // To see if there is any overlap in the bookings
        if (bookingsOverlap)
            return false;
        return true;
    }

    public bool ExistingBookings(int bookingId, int resourceId, DateTime startTime, DateTime endTime)
    {
        return bookings.Any(b => b.BookingId == bookingId && b.ResourceId == resourceId && b.StartTime == startTime && b.EndTime == endTime);
    }

    public bool IsBookingAdded(int bookingId, DateTime startTime, DateTime endTime, int resourceId)
    {
        return ExistingBookings(bookingId, resourceId, startTime, endTime);
    }

    public bool IsBookingOverlapping(int resourceId, DateTime startTime, DateTime endTime)
    {
        var bookingsForResource = bookings.Where(b => b.ResourceId == resourceId);
        foreach (var booking in bookingsForResource)
        {
            if (startTime < booking.EndTime && endTime > booking.StartTime)
            {
                return true; // There is an overlap
            }
        }
        return false; // No overlap found
    }

    public List<Booking> GetAllBookings()
    {
        return bookings;
    }

    public bool UpdateBooking(int id, Booking updatedBooking)
    {
        var existingBooking = bookings.FirstOrDefault(b => b.BookingId == id);
        if (existingBooking == null)
            return false;

        existingBooking.UserId = updatedBooking.UserId;
        existingBooking.ResourceId = updatedBooking.ResourceId;
        existingBooking.StartTime = updatedBooking.StartTime;
        existingBooking.EndTime = updatedBooking.EndTime;
        existingBooking.BookingType = updatedBooking.BookingType;

        return true;
    }

    public bool DeleteBooking(int bookingId)
    {
        var booking = bookings.FirstOrDefault(b => b.BookingId == bookingId);
        if (booking != null)
        {
            bookings.Remove(booking);
            return true; // Booking was found and removed
        }
        return false; // Booking not found
    }
}
