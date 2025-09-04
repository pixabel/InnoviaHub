using InnoviaHub.DTOs;
using InnoviaHub.Models;
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
        public IActionResult Register(RegisterUserDTO dto)
        {
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                IsAdmin = dto.IsAdmin
            };

            var createdUser = _authService.Register(user, dto.Password);
            return Ok(createdUser);

        }


        [HttpPost("login")]
        public IActionResult Login(LoginUserDTO dto)
        {
            var token = _authService.Login(dto.Email, dto.Password);
            if (token == null)
                return Unauthorized("Credentials not valid");

            return Ok(new { token });
        }

    }
}