using Backend.Services;
using InnoviaHub.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;

namespace Backend.Tests
{
    public class IsBookingAvailableTest
    {
        private InnoviaHubDB GetDbContext()
        {
            var options = new DbContextOptionsBuilder<InnoviaHubDB>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new InnoviaHubDB(options);
        }

        [Fact]
        public void Should_ReturnTrue_WhenTimeIsAvailable()
        {
            // Arrange
            var context = GetDbContext();
            var bookingService = new BookingService(context);
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
            var context = GetDbContext();
            var bookingService = new BookingService(context);
            var resourceId = 2;
            var userId = "user1";
            var bookingId = 1;
            var startTimeBooking = new DateTime(2025, 09, 01, 10, 0, 0);
            var endTimeBooking = new DateTime(2025, 09, 01, 11, 0, 0);

            // Create a booking that blocks the time
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
}