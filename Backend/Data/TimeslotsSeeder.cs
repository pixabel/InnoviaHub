using System;

namespace Backend.Data;

public class TimeslotsSeeder
{
    public static void SeedTimeslots(InnoviaHubDB context)
    {
        // If timeslots already exists, do nothing
        if (context.Timeslots.Any()) return;

        var resources = context.Resource.ToList();
        var today = DateTime.Today;
        var endDate = today.AddMonths(2);

        foreach (var resource in resources)
        {
            var currentDate = today;

            while (currentDate <= endDate)
            {
                // Skip weekends
                if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                    currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    var startTime = currentDate.AddHours(8);
                    var endTimeDay = currentDate.AddHours(17);

                    while (startTime < endTimeDay)
                    {
                        context.Timeslots.Add(new Timeslot
                        {
                            ResourceId = resource.ResourceId,
                            StartTime = startTime,
                            // Two hours slots
                            EndTime = startTime.AddHours(2)
                        });

                        startTime = startTime.AddHours(2);
                    }
                }

                currentDate = currentDate.AddDays(1);
            }
        }

        context.SaveChanges();
    }
}

