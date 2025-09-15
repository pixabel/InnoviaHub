using System.ComponentModel.DataAnnotations;
using InnoviaHub.Models;

public class Timeslot
{
    // public int TimeslotId { get; set; }
    // public DateTime StartTime { get; set; }
    // public DateTime EndTime { get; set; }
    // public bool IsBooked { get; set; }

    // // To connect to resource
    // public int ResourceId { get; set; }
    // public Resource Resource { get; set; } = null!;

        [Key]
        public int TimeslotId { get; set; }
        public int ResourceId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsBooked { get; set; }
}

