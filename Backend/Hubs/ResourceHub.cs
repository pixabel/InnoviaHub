using Microsoft.AspNetCore.SignalR;
using InnoviaHub.Models;

namespace InnoviaHub.Hubs
{
    public class ResourceHub : Hub
    {
        public async Task SendResourceUpdate(ResourceUpdate update)
        {
            await Clients.All.SendAsync("ReceiveResourceUpdate", update);
        }
    }
}