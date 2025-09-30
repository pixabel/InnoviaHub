namespace InnoviaHub.Models
{
    public class ResourceUpdate
    {
        public int ResourceId { get; set; }
        public string ResourceName { get; set; } = string.Empty;
        public string UpdateType { get; set; } = string.Empty;
    }
}