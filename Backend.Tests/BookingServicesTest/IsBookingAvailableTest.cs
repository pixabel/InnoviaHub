namespace Backend.Tests;

public class IsBookingAvailableTest

{
    [Fact]
    public void Should_ReturnTrue_WhenTimeIsAvailable()
    {
        // Arrange
        var bookingService = new BookingService();
        var bookingId = 1;
        var timeSpan = new DateTime(2025, 09, 01, 10, 0, 0);

        // Act
        var result = bookingService.IsBookingAvailable(bookingId, timeSpan);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void Should_ReturnFalse_WhenTimeNotAvailable()
    {
        // Arrange
        var bookingService = new BookingService();
        var bookingId = 1;
        var timeSpan = new DateTime(2025, 09, 01, 10, 0, 0);
        bookingService.CreateBooking(bookingId, timeSpan, "User1");
        // To simulate the booking being taken

        // Act
        var result = bookingService.IsBookingAvailable(bookingId, timeSpan);

        // Assert
        Assert.False(result);
    }
}
