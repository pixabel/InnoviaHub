using InnoviaHub.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class InnoviaHubDB : DbContext
    {
        public InnoviaHubDB(DbContextOptions<InnoviaHubDB> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Resource> Resource { get; set; }
        public DbSet<Booking> Booking { get; set; }
    }
}
