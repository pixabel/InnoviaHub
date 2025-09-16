using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using InnoviaHub.Models;

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
        public async Task<List<Booking>> GetAllBookingsAsync()
        {
            return await _context.Booking
                .Include(b => b.User)      // hämta även användarobjektet
                .Include(b => b.Resource)  // hämta även resursobjektet
                .ToListAsync();
        }

        // Hämta en bokning
        public async Task<Booking?> GetBookingByIdAsync(int id)
        {
            return await _context.Booking
                .Include(b => b.User)
                .Include(b => b.Resource)
                .FirstOrDefaultAsync(b => b.BookingId == id);
        }

        // Skapa bokning
        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            booking.DateOfBooking = DateTime.UtcNow; // sätt datumet
            _context.Booking.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        // Uppdatera bokning
        public async Task<bool> UpdateBookingAsync(Booking booking)
        {
            _context.Booking.Update(booking);
            await _context.SaveChangesAsync();
            return true;
        }

        // Ta bort bokning
        public async Task<bool> DeleteBookingAsync(int id)
        {
            var booking = await _context.Booking.FindAsync(id);
            if (booking == null) return false;

            _context.Booking.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}