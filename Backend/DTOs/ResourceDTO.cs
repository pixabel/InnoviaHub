using InnoviaHub.Models;
public class ResourceDTO
{
    public int ResourceId { get; set; }
    public required string ResourceName { get; set; }
    public BookingType ResourceType { get; set; }
    public int Capacity { get; set; }
    public int CurrentBookings { get; set; } 
    // New property to show current bookings, good for admin view
}