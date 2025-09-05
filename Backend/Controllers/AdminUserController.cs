using Backend.Services;
using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InnoviaHub.DTOs;
using Backend.DTOs;

namespace InnoviaHub.Controllers
{
    [ApiController]
    [Route ("api/[controller]")]
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
            //Kontrollera att användare som gör dett är admin
            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser == null || !currentUser.IsAdmin)
                return Forbid();

            var success = await _adminService.UpdateUserAsync(id, dto);
            if (!success)
                return NotFound();

            return NoContent();

        }
    }
}
