using Backend.Services;
using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // // Only users with the "Admin" role can access these endpoints
    [Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly AdminUserService _adminService;
        private readonly UserManager<User> _userManager;
        public AdminUserController(AdminUserService adminService, UserManager<User> userManager)
        {
            _adminService = adminService;
            _userManager = userManager;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _adminService.GetUserByIdAsync(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDTO dto)
        {
            // Removed admin check since authorization is handled by the [Authorize(Roles = "Admin")] attribute
            var success = await _adminService.UpdateUserAsync(id, dto);
            if (!success)
                return NotFound();

            return NoContent();

        }
    }
}
