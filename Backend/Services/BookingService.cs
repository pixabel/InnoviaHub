using InnoviaHub.Models;

namespace Backend.Services;

public class BookingService
{
    private List<Booking> bookings = new List<Booking>();
    private List<Resource> resources = new List<Resource>();

    public Booking CreateBooking(int userId, int resourceId, int bookingId, DateTime startTime, DateTime endTime)
    {
        var booking = new Booking
        {
            UserId = userId,
            ResourceId = resourceId,
            BookingId = bookingId,
            StartTime = startTime,
            EndTime = endTime,
            DateOfBooking = DateTime.Now
        };
        bookings.Add(booking);
        return booking;
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
