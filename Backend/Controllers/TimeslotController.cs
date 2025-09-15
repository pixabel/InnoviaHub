using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeslotController : ControllerBase
    {
        private readonly InnoviaHubDB _context;

        public TimeslotController(InnoviaHubDB context)
        {
            _context = context;
        }

        // [HttpGet("resources/{resourceId}/timeslots")]
        // public async Task<IActionResult> GetTimeslots(int resourceId, DateTime date)
        // {
        //     var slots = await _context.Timeslots
        //         .Where(t => t.ResourceId == resourceId && t.StartTime.Date == date.Date && !t.IsBooked)
        //         .ToListAsync();

        //     return Ok(slots);
        // }
        
        [HttpGet("resources/{resourceId}/timeslots")]
        public async Task<IActionResult> GetTimeslots(int resourceId, DateTime date)
        {
            var slots = await _context.Timeslots
                .Where(t => t.ResourceId == resourceId && t.StartTime.Date == date.Date)
                .ToListAsync();

            return Ok(slots);
        }
    }
}
