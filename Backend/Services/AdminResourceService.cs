using Backend.Data;
using InnoviaHub.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AdminResourceService
    {
        private readonly InnoviaHubDB _context;

        public AdminResourceService(InnoviaHubDB context)
        {
            _context = context;
        }

        public async Task<List<Resource>> GetAllAsync()
        {
            return await _context.Resources.ToListAsync();
        }

        public async Task<List<Resource>> GetByTypeAsync(BookingType type)
        {
            return await _context.Resources
                .Where(r => r.ResourceType == type)
                .ToListAsync();
        }

        public async Task<Resource> CreateAsync(Resource resource)
        {
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();
            return resource;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return false;

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}