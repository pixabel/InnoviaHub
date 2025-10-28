using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services;
public class AuthService
{
    // UserManager from IdentityCore to handle users in database
    private readonly UserManager<User> _userManager;
    private readonly ILogger<AuthService> _logger;

    // The key to sign the JWT token
    // Is fetched from environment variables
    private readonly string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")!;
    // Constructor to inject UserManager
    // Makes IdentityCore functions available without needing to write SQL queries
    public AuthService(UserManager<User> userManager, ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _logger = logger;
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
        // Log exactly which user object we are creating a token for
        _logger.LogInformation("GenerateJwtToken: creating token for User.Email={Email}, User.Id={Id}, IsAdmin={IsAdmin}", user?.Email, user?.Id, user?.IsAdmin);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtSecret);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Email ?? ""),
            new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName ?? ""),
            new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName ?? ""),
            new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
            new Claim("role", user.IsAdmin ? "Admin" : "User")
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}