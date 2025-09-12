using Backend.Data;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("resources/{resourceId}/timeslots")]
        public async Task<IActionResult> GetTimeslots(int resourceId, DateTime date)
        {
            var slots = await _context.Timeslots
                .Where(t => t.ResourceId == resourceId && t.StartTime.Date == date.Date && !t.IsBooked)
                .ToListAsync();

            return Ok(slots);
        }

        // ------------------ OBS ---------------------
        // Endpoint to clear all timeslots and reset timeslotId´s
        // Only to be used when changes in timeslot-schedule
        [Authorize(Roles = "Admin")]
        [HttpPost("resources/resetTimeslots")]
        public IActionResult ResetTimeslots([FromServices] InnoviaHubDB context)
        {
            context.Timeslots.RemoveRange(context.Timeslots);
            context.SaveChanges();
            context.Database.ExecuteSqlRaw("DBCC CHECKIDENT ('Timeslots', RESEED, 0)");

            return Ok("Timeslots har rensats och timeslotId nollställts");
        }

    }
}
