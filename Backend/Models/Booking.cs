using System;
using System.ComponentModel.DataAnnotations;

namespace InnoviaHub.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public BookingType BookingType { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public DateTime DateOfBooking { get; set; }
    }
}