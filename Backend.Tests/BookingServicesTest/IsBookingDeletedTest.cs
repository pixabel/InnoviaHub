namespace Backend.Tests;
using Backend.Services;
using InnoviaHub.Models;
using Xunit;

public class IsBookingDeletedTest
{
    [Fact]
    public void Should_ReturnTrue_WhenBookingIsDeleted()
    {
        // Arrange
        var bookingService = new BookingService();
        var userId = 1;
        var resourceId = 1;
        var bookingId = 1;
        var startTime = new DateTime(2025, 09, 01, 10, 0, 0);
        var endTime = new DateTime(2025, 09, 01, 11, 0, 0);

        var booking = new Booking
        {
            BookingId = bookingId,
            ResourceId = resourceId,
            UserId = userId,
            StartTime = startTime,
            EndTime = endTime
        };

        bookingService.CreateBooking(booking);
        // Simulate adding a booking to list

        // Act
        var result = bookingService.DeleteBooking(bookingId);

        //Assert
        Assert.True(result);
        // Checks that the method returns true when a booking is deleted
        // Tests return value of method

        Assert.False(bookingService.ExistingBookings(bookingId, resourceId, startTime, endTime));
        // Extra assert to check that the booking is no longer in list
        // Tests state of object after method call
    }
}