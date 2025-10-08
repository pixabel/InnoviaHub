using Backend.Services;
using InnoviaHub.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;

namespace Backend.Tests
{
    public class IsBookingAddedTest
    {
        private InnoviaHubDB GetDbContext()
        {
            var options = new DbContextOptionsBuilder<InnoviaHubDB>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new InnoviaHubDB(options);
        }

        [Fact]
        public void Should_ReturnTrue_WhenBookingIsAdded()
        {
            // Arrange
            var context = GetDbContext();
            var bookingService = new BookingService(context);
            var booking = new Booking
            {
                BookingId = 1,
                StartTime = new DateTime(2025, 09, 01, 10, 0, 0),
                EndTime = new DateTime(2025, 09, 01, 11, 0, 0),
                ResourceId = 1,
                UserId = "1" 
            };

            // Act
            bookingService.CreateBooking(booking);

            // Assert
            var bookingExists = context.Bookings.Any(b =>
                b.BookingId == booking.BookingId &&
                b.StartTime == booking.StartTime &&
                b.EndTime == booking.EndTime &&
                b.ResourceId == booking.ResourceId);

            Assert.True(bookingExists);
        }
    }
}