using System;

namespace InnoviaHub.Models
{
    public class Resource
    {
        public int ResourceId { get; set; }
        public required string ResourceName { get; set; } // e.g Mötesrum
        public BookingType ResourceType { get; set; } // Enum
        public int Capacity { get; set; } // e.g 4 rooms, 1 VR headset
    }
}