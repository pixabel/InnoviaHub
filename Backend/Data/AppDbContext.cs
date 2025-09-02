using Microsoft.EntityFrameworkCore;
using InnoviaHub.Models;

namespace InnoviaHub.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Resource> Resources { get; set; }
        
    }
}