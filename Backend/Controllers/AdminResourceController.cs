using InnoviaHub.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminResourceController : ControllerBase
    {
        private readonly AdminResourceService _service;

        public AdminResourceController(AdminResourceService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var resources = await _service.GetAllAsync();
            return Ok(resources);
        }

        [HttpGet("type/{type}")]
        public async Task<IActionResult> GetByType(string type)
        {
            if (!Enum.TryParse<BookingType>(type, out var bookingType))
                return BadRequest("Ogiltig resurstyp");

            var resources = await _service.GetByTypeAsync(bookingType);
            return Ok(resources);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Resource resource)
        {
            var created = await _service.CreateAsync(resource);
            return Ok(created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}