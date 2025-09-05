using Backend.DTOs;
using InnoviaHub.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AdminUserService
    {
        private readonly UserManager<User> _userManager;

        public AdminUserService (UserManager<User> userManager)
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

            if(user == null)
                return false;

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.IsAdmin = dto.IsAdmin;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}
