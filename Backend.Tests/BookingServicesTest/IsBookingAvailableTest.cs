namespace Backend.Tests;

using InnoviaHub.Models;
using Backend.Services;
using Xunit;
public class IsBookingAvailableTest
{
    [Fact]
    public void Should_ReturnTrue_WhenTimeIsAvailable()
    {
        // Arrange
        var bookingService = new BookingService();
        var resourceId = 2;
        var startTime = new DateTime(2025, 09, 01, 10, 0, 0);
        var endTime = new DateTime(2025, 09, 01, 11, 0, 0);

        // Act
        var result = bookingService.IsBookingAvailable(resourceId, startTime, endTime);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void Should_ReturnFalse_WhenTimeNotAvailable()
    {
        // Arrange
        var bookingService = new BookingService();
        var resourceId = 2;
        var userId = 1;
        var bookingId = 1;
        var startTimeBooking = new DateTime(2025, 09, 01, 10, 0, 0);
        var endTimeBooking = new DateTime(2025, 09, 01, 11, 0, 0);

        // Skapar en bokning som blockerar tiden
        var booking = new Booking
        {
            BookingId = bookingId,
            ResourceId = resourceId,
            UserId = userId,
            StartTime = startTimeBooking,
            EndTime = endTimeBooking
        };
        bookingService.CreateBooking(booking);

        var startTimeTest = new DateTime(2025, 09, 01, 10, 30, 0);
        var endTimeTest = new DateTime(2025, 09, 01, 11, 30, 0);

        // Act
        var result = bookingService.IsBookingAvailable(resourceId, startTimeTest, endTimeTest);

        // Assert
        Assert.False(result);
    }
}
