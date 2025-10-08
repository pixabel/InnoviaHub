using Backend.Services;
using InnoviaHub.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;

namespace Backend.Tests
{
    public class IsBookingDeletedTest
    {
        private InnoviaHubDB GetDbContext()
        {
            var options = new DbContextOptionsBuilder<InnoviaHubDB>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new InnoviaHubDB(options);
        }

        [Fact]
        public void Should_ReturnTrue_WhenBookingIsDeleted()
        {
            // Arrange
            var context = GetDbContext();
            var bookingService = new BookingService(context);
            var userId = "1"; 
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

            // Act
            var result = bookingService.DeleteBooking(bookingId);

            // Assert the method returns true
            Assert.True(result);

            // Assert booking is no longer in the database
            var bookingStillExists = context.Bookings.Any(b =>
                b.BookingId == bookingId &&
                b.ResourceId == resourceId &&
                b.StartTime == startTime &&
                b.EndTime == endTime);

            Assert.False(bookingStillExists);
        }
    }
}