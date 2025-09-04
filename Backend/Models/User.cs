using System;

namespace InnoviaHub.Models
{
    public class User
{
    public int UserId { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public string PasswordHash { get; set; }
    public bool IsAdmin { get; set; }
}
}