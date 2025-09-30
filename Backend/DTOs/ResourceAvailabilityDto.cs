namespace InnoviaHub.DTOs
{
    public class ResourceAvailabilityDto
    {
        public required bool[] MeetingRooms { get; set; }
        public required bool[] VRHeadsets { get; set; }
        public int Desk { get; set; }
        public int AIServer { get; set; }
    }

}