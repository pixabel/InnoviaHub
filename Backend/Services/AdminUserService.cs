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

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _userManager.Users.ToListAsync();
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

            // Uppdatera användarens info först
            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded) return false;

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (dto.IsAdmin && !currentRoles.Contains("Admin"))
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded) return false;

                var addResult = await _userManager.AddToRoleAsync(user, "Admin");
                if (!addResult.Succeeded) return false;
            }
            else if (!dto.IsAdmin && currentRoles.Contains("Admin"))
            {
                var removeResult = await _userManager.RemoveFromRoleAsync(user, "Admin");
                if (!removeResult.Succeeded) return false;

                var addResult = await _userManager.AddToRoleAsync(user, "Medlem");
                if (!addResult.Succeeded) return false;
            }

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
