using InnoviaHub.DTOs;
using InnoviaHub.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Identity;

namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly UserManager<User> _userManager;

        public AuthController(AuthService authService, UserManager<User> userManager)
        {
            _authService = authService;
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDTO dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                UserName = dto.Email,
                IsAdmin = false
            };

            var createdUser = await _authService.Register(user, dto.Password);
            return Ok(createdUser);

        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDTO dto)
        {
            var token = await _authService.Login(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized("Credentials not valid");

            return Ok(new { token });
        }
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            // Try to get the subject (sub) claim first
            var sub = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
            User? user = null;

            if (!string.IsNullOrEmpty(sub))
            {
                user = await _userManager.FindByIdAsync(sub);
            }

            // If not found by id, try by email (unique_name or ClaimTypes.Name)
            if (user == null)
            {
                var email = User.FindFirstValue(JwtRegisteredClaimNames.UniqueName) ?? User.FindFirstValue(ClaimTypes.Name);
                if (!string.IsNullOrEmpty(email))
                {
                    user = await _userManager.FindByEmailAsync(email);
                }
            }

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                isAdmin = user.IsAdmin
            });
        }

    }
}