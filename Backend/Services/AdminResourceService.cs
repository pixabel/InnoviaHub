using Backend.Data;
using InnoviaHub.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AdminResourceService
    {
        private readonly InnoviaHubDB _context;

        public AdminResourceService(InnoviaHubDB context)
        {
            _context = context;
        }

        public async Task<List<Resource>> GetAllAsync()
        {
            return await _context.Resources.ToListAsync();
        }

        public async Task<List<Resource>> GetByTypeAsync(BookingType type)
        {
            return await _context.Resources
                .Where(r => r.ResourceType == type)
                .ToListAsync();
        }

        public async Task<Resource> CreateAsync(Resource resource)
        {
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            // Create timeslots for the new resource
            GenerateTimeslotsForResource(resource);

            await _context.SaveChangesAsync();
            return resource;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null) return false;

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();
            return true;
        }

        private void GenerateTimeslotsForResource(Resource resource)
        {
            var today = DateTime.Today;
            var endDate = today.AddMonths(2);
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Stockholm");

            var currentDate = today;

            while (currentDate <= endDate)
            {
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    var localStart = new DateTime(
                        currentDate.Year,
                        currentDate.Month,
                        currentDate.Day,
                        8, 0, 0,
                        DateTimeKind.Unspecified);

                    var localEnd = localStart.AddHours(10); // 08 → 18

                    var startTimeUtc = TimeZoneInfo.ConvertTimeToUtc(localStart, tz);
                    var endTimeUtc = TimeZoneInfo.ConvertTimeToUtc(localEnd, tz);

                    while (startTimeUtc < endTimeUtc)
                    {
                        _context.Timeslots.Add(new Timeslot
                        {
                            ResourceId = resource.ResourceId,
                            StartTime = startTimeUtc,
                            EndTime = startTimeUtc.AddHours(2)
                        });

                        startTimeUtc = startTimeUtc.AddHours(2);
                    }
                }
                currentDate = currentDate.AddDays(1);
            }
        }
    }
}