using Backend.DTOs;
using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AdminUserService
    {
        private readonly UserManager<User> _userManager;

        public AdminUserService(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<List<UserListDTO>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            return users.Select(u => new UserListDTO
            {
                Id = u.Id,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.IsAdmin ? "Admin" : "Medlem"
            }).ToList();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _userManager.FindByIdAsync(id);
        }

        public async Task<bool> UpdateUserAsync(string id, UpdateUserDTO dto)
{
    var user = await _userManager.FindByIdAsync(id);
    if (user == null) return false;

    user.FirstName = dto.FirstName;
    user.LastName = dto.LastName;
    user.Email = dto.Email;
    user.UserName = dto.Email;
    user.IsAdmin = dto.IsAdmin;

    var updateResult = await _userManager.UpdateAsync(user);
    if (!updateResult.Succeeded) return false;

    return true;
}

        public async Task<bool> DeleteUserAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
