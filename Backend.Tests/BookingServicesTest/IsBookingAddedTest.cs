namespace Backend.Tests;
using Backend.Services;
using InnoviaHub.Models;
using Xunit;
public class IsBookingAddedTest

{
    [Fact]
public void Should_ReturnTrue_WhenBookingIsAdded()
{
    // Arrange
    var bookingService = new BookingService();
    var booking = new Booking
    {
        BookingId = 1,
        StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
        EndTime = new DateTime(2025, 09, 01, 11, 0, 0),
        ResourceId = 1,
        UserId = 1
    };

    // Act
    bookingService.CreateBooking(booking);
    var result = bookingService.IsBookingAdded(
        booking.BookingId,
        booking.StartTime,
        booking.EndTime,
        booking.ResourceId);

    // Assert
    Assert.True(result);
}
}
