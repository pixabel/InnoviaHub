using Backend.Data;
using InnoviaHub.Models;
public static class SeedData
{
    public static void SeedTimeslots(InnoviaHubDB context)
    {
        // How long ahead slots will be created
        int daysAhead = 90;

        // Between which hours resource should be available
        var openingHour = 8;
        var closingHour = 18;

        // Fetch all resources
        var resources = context.Resources.ToList();

        foreach (var resource in resources)
        {
            for (int day = 0; day < daysAhead; day++)
            {
                var date = DateTime.Today.AddDays(day);

                // Skip weekends
                if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                    continue;

                // Loop every hour between opening and closing hour
                for (int hour = openingHour; hour < closingHour; hour++)
                {
                    var start = new DateTime(date.Year, date.Month, date.Day, hour, 0, 0);
                    var end = start.AddHours(1);

                    // Check if slot already exits to avoid duplicate
                    bool exists = context.Timeslots.Any(t =>
                    t.ResourceId == resource.ResourceId &&
                    t.StartTime == start);

                    if (!exists)
                    {
                        context.Timeslots.Add(new Timeslot
                        {
                            ResourceId = resource.ResourceId,
                            StartTime = start,
                            EndTime = end,
                            IsBooked = false
                        });
                    }
                }
            }
        }

        context.SaveChanges();
    }
}