using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using InnoviaHub.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    // Route for the controller and mark it as an API controller
    [Route("api/[controller]")]
    [ApiController]
    // // Only users with the "Admin" role can access these endpoints
    [Authorize(Roles = "Admin")]
    public class AdminResourceController : ControllerBase
    {
        private readonly InnoviaHubDB _context;

        // Inject the database context via constructor
        public AdminResourceController(InnoviaHubDB context)
        {
            _context = context;
        }

        // GET: api/AdminResource
        // Returns a list of all resources
        [HttpGet]
        public async Task<IActionResult> GetResources()
        {
            var resources = await _context.Resources.ToListAsync();
            return Ok(resources);
        }

        // GET: api/AdminResource/{id}
        // Returns a single resource by its ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
                return NotFound(); // Return 404 if not found

            return Ok(resource);
        }

        // POST: api/AdminResource
        // Creates a new resource
        [HttpPost]
        public async Task<IActionResult> CreateResource([FromQuery]Resource resource)
        {
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            // Return 201 Created with the location of the new resource
            return CreatedAtAction(nameof(GetResource), new { id = resource.ResourceId }, resource);
        }

        // PUT: api/AdminResource/{id}
        // Updates an existing resource by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResource(int id, Resource resource)
        {
            if (id != resource.ResourceId)
                return BadRequest(); // Return 400 if ID mismatch

            try
            {
                // Find the existing resource in the database
                var existingResource = await _context.Resources.FindAsync(id);
                if (existingResource == null) return NotFound(); // Return 404 if not found

                // Update the resource fields
                existingResource.ResourceName = resource.ResourceName;
                existingResource.ResourceType = resource.ResourceType;
                existingResource.Capacity = resource.Capacity;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle concurrency issues
                if (!_context.Resources.Any(r => r.ResourceId == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent(); // Return 204 No Content on success
        }

        // DELETE: api/AdminResource/{id}
        // Deletes a resource by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
                return NotFound(); // Return 404 if resource doesn't exist

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return NoContent(); // Return 204 No Content on success
        }
    }
}
