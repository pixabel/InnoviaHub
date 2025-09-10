using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;
using InnoviaHub.Models;

namespace InnoviaHub.Hubs
{
    [Route("/bookinghub")]
    public class BookingHub : Hub
    {
        public async Task SendBookingUpdate(BookingUpdate update)
        {
            await Clients.All.SendAsync("RecieveBookingUpdate", update);
        }
    }
}