using System;
using System.ComponentModel.DataAnnotations;

namespace InnoviaHub.Models
{
    public class Booking
    {
        [Key]
        public int UserId { get; set; }
        public int BookingId { get; set; }
        public int ResourceId { get; set; }
        //To connect Booking to Resource
        public BookingType BookingType { get; set; }
        [Required]
        public DateTime StartTime { get; set; }
        [Required]
        public DateTime EndTime { get; set; }
        public DateTime DateOfBooking { get; set; }
    }
}