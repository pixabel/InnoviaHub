using Backend.Services;
using InnoviaHub.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;

namespace Backend.Tests
{
    public class IsBookingOverlappingTest
    {
        private InnoviaHubDB GetDbContext()
        {
            var options = new DbContextOptionsBuilder<InnoviaHubDB>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new InnoviaHubDB(options);
        }

        [Fact]
        public void Should_Return_True_WhenNotOverlapping()
        {
            // Arrange
            var context = GetDbContext();
            var bookingService = new BookingService(context);
            var booking = new Booking
            {
                BookingId = 1,
                UserId = "1", 
                ResourceId = 1,
                StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
                EndTime = new DateTime(2025, 09, 01, 12, 0, 0)
            };
            bookingService.CreateBooking(booking);

            var testStart = new DateTime(2025, 09, 01, 12, 0, 0);
            var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

            // Act
            var isAvailable = bookingService.IsBookingAvailable(booking.ResourceId, testStart, testEnd);

            // Assert true = NOT overlapping
            Assert.True(isAvailable);
        }

        [Fact]
        public void Should_Return_False_WhenOverlapping()
        {
            // Arrange
            var context = GetDbContext();
            var bookingService = new BookingService(context);
            var booking = new Booking
            {
                BookingId = 1,
                UserId = "1",
                ResourceId = 1,
                StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
                EndTime = new DateTime(2025, 09, 01, 12, 0, 0)
            };
            bookingService.CreateBooking(booking);

            var testStart = new DateTime(2025, 09, 01, 11, 0, 0);
            var testEnd = new DateTime(2025, 09, 01, 13, 0, 0);

            // Act
            var isAvailable = bookingService.IsBookingAvailable(booking.ResourceId, testStart, testEnd);

            // Assert (false = overlapping)
            Assert.False(isAvailable);
        }
    }
}