namespace Backend.Tests;

public class IsBookingDeletedTest
{
    [Fact]
    public void Should_ReturnTrue_WhenBookingIsDeleted()
    {
        // Arrange
        var bookingService = new BookingService();
        var bookingId = 1;
        bookingService.CreateBooking(bookingId, new DateTime(2025, 09, 01, 10, 0, 0), "User1");
        // Simulate adding a booking to list

        // Act
        var result = bookingService.DeleteBooking(bookingId);

        //Assert
        Assert.True(result);
        // Checks that the method returns true when a booking is deleted
        // Tests return value of method
        
        Assert.False(bookingService.ExistingBooking(bookingId));
        // Extra assert to check that the booking is no longer in list
        // Tests state of object after method call
    }
}