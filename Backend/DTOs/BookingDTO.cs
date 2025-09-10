using InnoviaHub.Models;

namespace InnoviaHub.DTOs
{
    public class BookingDTO
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int ResourceId { get; set; }
        public BookingType BookingType { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime DateOfBooking { get; set; }
    }
}