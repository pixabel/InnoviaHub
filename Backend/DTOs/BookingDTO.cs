using InnoviaHub.Models;
public class BookingDTO
{
    public int BookingId { get; set; }
    public ProfileUserDTO User { get; set; } = null!;
    // Instead of just UserId, include full user details in the booking DTO.
    // This allows the frontend to see who made the booking without extra API calls.
    public int ResourceId { get; set; }
    public BookingType BookingType { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime DateOfBooking { get; set; }
}