using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.SignalR;
using InnoviaHub.Models;

namespace InnoviaHub.Hubs
{
    public class BookingHub : Hub
    {
        public async Task SendBookingUpdate(BookingUpdate update)
        {
            await Clients.All.SendAsync("ReceiveBookingUpdate", update);
        }
    }
}