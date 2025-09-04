using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.Models
{
    public class User : IdentityUser
{
    // Removed Id, Email and PasswordHash
    // since they are inherited from IdentityUser
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public bool IsAdmin { get; set; }
}
}