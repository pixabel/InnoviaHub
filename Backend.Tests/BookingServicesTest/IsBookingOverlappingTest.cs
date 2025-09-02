using Backend.Services;
using InnoviaHub.Models;
using Xunit;

public class IsBookingOverlappingTest
{
    [Fact]
    public void Should_Return_False_WhenNotOverlapping()
    {
        // Arrange
        var bookingService = new BookingService();
        var booking = new Booking
        {
            BookingId = 1,
            UserId = 1,
            ResourceId = 1,
            StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
            EndTime = new DateTime(2025, 09, 01, 12, 0, 0)
        };
        bookingService.CreateBooking(booking);

        var testStart = new DateTime(2025, 09, 01, 12, 0, 0);
        var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

        // Act
        var result = bookingService.IsBookingOverlapping(booking.ResourceId, testStart, testEnd);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void Should_Return_True_WhenOverlapping()
    {
        // Arrange
        var bookingService = new BookingService();
        var booking = new Booking
        {
            BookingId = 1,
            UserId = 1,
            ResourceId = 1,
            StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
            EndTime = new DateTime(2025, 09, 01, 12, 0, 0)
        };
        bookingService.CreateBooking(booking);

        var testStart = new DateTime(2025, 09, 01, 11, 0, 0);
        var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

        // Act
        var result = bookingService.IsBookingOverlapping(booking.ResourceId, testStart, testEnd);

        // Assert
        Assert.True(result);
    }
}