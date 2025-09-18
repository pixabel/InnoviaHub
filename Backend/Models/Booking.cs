using System;
using System.ComponentModel.DataAnnotations;

namespace InnoviaHub.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public string UserId { get; set; } = null!;
        public User? User { get; set; }  
        public int ResourceId { get; set; }
        public Resource? Resource { get; set; } 
    
        //To connect Booking to Resource
        public BookingType BookingType { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public DateTime DateOfBooking { get; set; }
    }
}