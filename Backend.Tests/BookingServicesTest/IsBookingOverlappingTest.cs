namespace Backend.Tests;

public class IsBookingOverlappingTest
{
    [Fact]
    public void Should_Return_False_WhenNotOverlapping()
    {
        // Arrange
        var bookingService = new BookingService();
        var resourceId = 1;
        bookingService.CreateBooking(
            resourceId,
            new DateTime(2025, 09, 01, 10, 0, 0),
            new DateTime(2025, 09, 01, 12, 0, 0),
            "User1"
            );
        // To simulate a booking between 10-12

        var testStart = new DateTime(2025, 09, 01, 12, 0, 0);
        var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

        // Act
        var result = bookingService.IsBookingOverlapping(resourceId, testStart, testEnd);

        // Assert
        Assert.False(result);
        // Tells us booking is not overlapping and can therefore be added

    }

    [Fact]
    public void Should_Return_True_WhenOverlapping()
    {
        // Arrange
        var bookingService = new BookingService();
        var resourceId = 1;
        bookingService.CreateBooking(
            resourceId,
            new DateTime(2025, 09, 01, 10, 0, 0),
            new DateTime(2025, 09, 01, 12, 0, 0),
            "User1"
            );
        // To simulate a booking between 10-12

        var testStart = new DateTime(2025, 09, 01, 11, 0, 0);
        var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

        // Act
        var result = bookingService.IsBookingOverlapping(resourceId, testStart, testEnd);

        // Assert
        Assert.True(result);
        // Tells us booking IS overlapping and can therefore NOT be added
    }
}
