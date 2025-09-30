using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InnoviaHub.Hubs;
using Microsoft.AspNetCore.SignalR;
using InnoviaHub.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly InnoviaHubDB _context;
        private readonly IHubContext<ResourceHub> _hubContext;
        private readonly ILogger<ResourceController> _logger;

        public ResourceController(InnoviaHubDB context, IHubContext<ResourceHub> hubContext, ILogger<ResourceController> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
                return NotFound();

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            // Send SignalR notification
            var update = new ResourceUpdate
            {
                ResourceId = resource.ResourceId,
                ResourceName = resource.ResourceName,
                UpdateType = "Deleted"
            };
            await _hubContext.Clients.All.SendAsync("ReceiveResourceUpdate", update);

            return NoContent();
        }
        
        [HttpGet("ResourceAvailability")]
        public async Task<IActionResult> GetResourceAvailability()
        {
            var resources = await _context.Resources
                .Include(r => r.Timeslots)
                .ToListAsync();

            var meetingRooms = resources.Where(r => r.ResourceType == BookingType.MeetingRoom).OrderBy(r => r.ResourceName).ToList();
            var vrHeadsets = resources.Where(r => r.ResourceType == BookingType.VRHeadset).OrderBy(r => r.ResourceName).ToList();

            bool IsAvailable(Resource r) =>
                !r.Timeslots.Any(ts =>
                    ts.StartTime <= DateTime.UtcNow && ts.EndTime > DateTime.UtcNow
                );

            var meetingRoomsStatus = meetingRooms.Select(r => IsAvailable(r)).ToArray();
            var vrHeadsetsStatus = vrHeadsets.Select(r => IsAvailable(r)).ToArray();

            int deskCount = resources.Count(r => r.ResourceType == BookingType.Desk && IsAvailable(r));
            int aiServerCount = resources.Count(r => r.ResourceType == BookingType.AIServer && IsAvailable(r));

            // Debug output
            foreach(var r in meetingRooms)
            {
                foreach(var ts in r.Timeslots)
                {
                    _logger.LogInformation($"Room: {r.ResourceName}, Start(UTC): {ts.StartTime}, End(UTC): {ts.EndTime}, utcNow: {DateTime.UtcNow}");
                }
            }

            return Ok(new
            {
                MeetingRooms = meetingRoomsStatus,
                VRHeadsets = vrHeadsetsStatus,
                Desk = deskCount,
                AIServer = aiServerCount
            });
        }
    }
}
