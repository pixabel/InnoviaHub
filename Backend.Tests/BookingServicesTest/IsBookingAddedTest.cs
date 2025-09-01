namespace Backend.Tests;
using Backend.Services;
using Xunit;
public class IsBookingAddedTest

{
    [Fact]
    public void Should_ReturnTrue_WhenBookingIsAdded()
    {
        // Arrange
        var bookingService = new BookingService();
        var bookingId = 1;
        var startTime = new DateTime(2025, 09, 01, 10, 0, 0);
        var endTime = new DateTime(2025, 09, 01, 11, 0, 0);
        var resourceId = 1;
        var userId = 1;

        // Act
        bookingService.CreateBooking(userId, resourceId, bookingId, startTime, endTime);
        // Simulate adding a booking to list
        var result = bookingService.IsBookingAdded(bookingId, startTime, endTime, resourceId);

        // Assert
        Assert.True(result);
    }
}
