namespace Backend.DTOs
{
    public class UpdateUserDTO
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public bool IsAdmin { get; set; }
    }
}
