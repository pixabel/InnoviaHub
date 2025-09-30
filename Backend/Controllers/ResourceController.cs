using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InnoviaHub.Hubs;
using Microsoft.AspNetCore.SignalR;
using InnoviaHub.Models;
using InnoviaHub.DTOs;

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

    bool IsAvailable(Resource r) =>
        !r.Timeslots.Any(ts =>
            ts.StartTime <= DateTime.UtcNow && ts.EndTime > DateTime.UtcNow && ts.IsBooked
        );

    var meetingRoomsStatus = resources
        .Where(r => r.ResourceType == BookingType.MeetingRoom)
        .OrderBy(r => r.ResourceName)
        .Select(r => IsAvailable(r))
        .ToArray();

    var vrHeadsetsStatus = resources
        .Where(r => r.ResourceType == BookingType.VRHeadset)
        .OrderBy(r => r.ResourceName)
        .Select(r => IsAvailable(r))
        .ToArray();

    var deskCount = resources.Count(r => r.ResourceType == BookingType.Desk && IsAvailable(r));
    var aiServerCount = resources.Count(r => r.ResourceType == BookingType.AIServer && IsAvailable(r));

    var dto = new ResourceAvailabilityDto
    {
        MeetingRooms = meetingRoomsStatus,
        VRHeadsets = vrHeadsetsStatus,
        Desk = deskCount,
        AIServer = aiServerCount
    };

    return Ok(dto);
}



    }
}
