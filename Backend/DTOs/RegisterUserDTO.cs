using InnoviaHub.Models;

namespace InnoviaHub.DTOs
{
    public class RegisterUserDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool IsAdmin { get; set; } = false;
    }
}