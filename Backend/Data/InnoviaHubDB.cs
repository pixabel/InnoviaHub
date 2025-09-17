using InnoviaHub.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Backend.Data
{
    public class InnoviaHubDB : IdentityDbContext<User>
    {
        public InnoviaHubDB(DbContextOptions<InnoviaHubDB> options) : base(options)
        {
        }
        public DbSet<Resource> Resources { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Timeslot> Timeslots { get; set; }
          // Add resources to dataase
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Resource>().HasData(
        // Mötesrum (4 st)
        new Resource { ResourceId = 1, ResourceName = "Mötesrum 1", ResourceType = BookingType.MeetingRoom, Capacity = 1 },
        new Resource { ResourceId = 2, ResourceName = "Mötesrum 2", ResourceType = BookingType.MeetingRoom, Capacity = 1 },
        new Resource { ResourceId = 3, ResourceName = "Mötesrum 3", ResourceType = BookingType.MeetingRoom, Capacity = 1 },
        new Resource { ResourceId = 4, ResourceName = "Mötesrum 4", ResourceType = BookingType.MeetingRoom, Capacity = 1 },

        // Skrivbord (15 st)
        new Resource { ResourceId = 5, ResourceName = "Skrivbord 1", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 6, ResourceName = "Skrivbord 2", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 7, ResourceName = "Skrivbord 3", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 8, ResourceName = "Skrivbord 4", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 9, ResourceName = "Skrivbord 5", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 10, ResourceName = "Skrivbord 6", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 11, ResourceName = "Skrivbord 7", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 12, ResourceName = "Skrivbord 8", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 13, ResourceName = "Skrivbord 9", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 14, ResourceName = "Skrivbord 10", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 15, ResourceName = "Skrivbord 11", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 16, ResourceName = "Skrivbord 12", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 17, ResourceName = "Skrivbord 13", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 18, ResourceName = "Skrivbord 14", ResourceType = BookingType.Desk, Capacity = 1 },
        new Resource { ResourceId = 19, ResourceName = "Skrivbord 15", ResourceType = BookingType.Desk, Capacity = 1 },

        // VR Headset (4 st)
        new Resource { ResourceId = 20, ResourceName = "VR Headset 1", ResourceType = BookingType.VRHeadset, Capacity = 1 },
        new Resource { ResourceId = 21, ResourceName = "VR Headset 2", ResourceType = BookingType.VRHeadset, Capacity = 1 },
        new Resource { ResourceId = 22, ResourceName = "VR Headset 3", ResourceType = BookingType.VRHeadset, Capacity = 1 },
        new Resource { ResourceId = 23, ResourceName = "VR Headset 4", ResourceType = BookingType.VRHeadset, Capacity = 1 },

        // AI Server (1 st)
        new Resource { ResourceId = 24, ResourceName = "AI Server", ResourceType = BookingType.AIServer, Capacity = 1 }
    );
        }
    }
}
