
// DTO to return user profile information without sensitive data like password.
namespace InnoviaHub.DTOs
{
    public class ProfileUserDTO
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        // FullName is mapped from FirstName + LastName for easier display in controllers.
        public required string Email { get; set; }
    }
}