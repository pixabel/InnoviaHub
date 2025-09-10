using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services;

public class AuthService
{
    // UserManager from IdentityCore to handle users in database
    private readonly UserManager<User> _userManager;

    // The key to sign the JWT token
    // Is fetched from environment variables
    private readonly string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")!;

    // Constructor to inject UserManager
    // Makes IdentityCore functions available without needing to write SQL queries
    public AuthService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<User> Register(User user, string password)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(user.Email!);
        if (existingUser != null) throw new Exception("User aldready exists");

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded) throw new Exception("Failed to create user");

        return user;
    }

    // String instead of User in <> to return JWT token
    public async Task<string?> Login(string email, string password)
    {
        // Checks if user exists in database
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return null;

        // If password is not correct compared to databse, return null
        if (!await _userManager.CheckPasswordAsync(user, password)) return null;

        // If user exists and password is correct, generate JWT token
        return GenerateJwtToken(user);
    }

    // Generates a JWT token for the logged in user
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email!),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName ?? ""),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName ?? "")
        }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}