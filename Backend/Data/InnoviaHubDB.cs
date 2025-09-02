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
          // Add resources to dataase
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Resource>().HasData(
                new Resource { ResourceId = 1, ResourceName = "Mötesrum", ResourceType = BookingType.MeetingRoom, Capacity = 4 },
                new Resource { ResourceId = 2, ResourceName = "Skrivbord", ResourceType = BookingType.Desk, Capacity = 15 },
                new Resource { ResourceId = 3, ResourceName = "VR Headset", ResourceType = BookingType.VRHeadset, Capacity = 4 },
                new Resource { ResourceId = 4, ResourceName = "AI Server", ResourceType = BookingType.AIServer, Capacity = 1 }
            );
        }
    }
}
