using Backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using InnoviaHub.Models;
using InnoviaHub.DTOs;

namespace Backend.Services
{
    public class AdminBookingService
    {
        private readonly InnoviaHubDB _context;

        public AdminBookingService(InnoviaHubDB context)
        {
            _context = context;
        }

        // Hämta alla bokningar
        public async Task<List<BookingDTO>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Resource)
                .Select(b => new BookingDTO
                {
                    BookingId = b.BookingId,
                    UserId = b.UserId,
                    MemberName = b.User.FirstName + " " + b.User.LastName, // ✅ Hämtar riktiga namn
                    ResourceId = b.ResourceId,
                    ResourceName = b.Resource.ResourceName,
                    BookingType = b.BookingType,
                    StartTime = b.StartTime,
                    EndTime = b.EndTime,
                    DateOfBooking = b.DateOfBooking
                }).ToListAsync();
        }

        // Hämta en bokning
        public async Task<Booking?> GetBookingByIdAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Resource)
                .FirstOrDefaultAsync(b => b.BookingId == id);
        }

        // Skapa bokning
        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            booking.DateOfBooking = DateTime.UtcNow; // sätt datumet
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        // Uppdatera bokning
        public async Task<bool> UpdateBookingAsync(Booking booking)
        {
            _context.Bookings.Update(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        // Ta bort bokning
        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null) return false;

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}