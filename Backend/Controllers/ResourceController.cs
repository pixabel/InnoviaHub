using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly InnoviaHubDB _context;

        public ResourceController(InnoviaHubDB context)
        {
            _context = context;
        }
 
        [HttpGet]
        public async Task<IActionResult> GetResources()
        {
            var resources = await _context.Resources
                .Include(r => r.Timeslots)
                .ToListAsync();
            return Ok(resources);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
                return NotFound();

            return Ok(resource);
        }
    }
}
