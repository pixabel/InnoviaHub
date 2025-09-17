using InnoviaHub.Models;

namespace InnoviaHub.DTOs
{
    public class CreateBookingDTO
    {
        public string UserId { get; set; } = null!;
        public int ResourceId { get; set; }
        public BookingType BookingType { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
