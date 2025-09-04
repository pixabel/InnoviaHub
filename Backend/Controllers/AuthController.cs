using InnoviaHub.DTOs;
using InnoviaHub.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
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

    }
}