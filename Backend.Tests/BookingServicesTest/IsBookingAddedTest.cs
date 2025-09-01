namespace Backend.Tests;

public class IsBookingAddedTest

{
    [Fact]
    public void Should_ReturnTrue_WhenBookingIsAdded()
    {
        // Arrange
        var bookingService = new BookingService();
        var bookingId = 1;
        var timeSpan = new DateTime(2025, 09, 01, 10, 0, 0);
        var resourceId = 1;

        // Act
        bookingService.CreateBooking(bookingId, timeSpan, "User1");
        // Simulate adding a booking to list
        var result = bookingService.IsBookingAdded(bookingId, timeSpan, resourceId);

        // Assert
        Assert.True(result);
    }
}
