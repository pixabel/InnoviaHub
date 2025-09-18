using System;

namespace Backend.Data
{
    public class TimeslotsSeeder
    {
        public static void SeedTimeslots(InnoviaHubDB context)
        {
            // If timeslots already exist, do nothing
            if (context.Timeslots.Any()) return;

            var resources = context.Resources.ToList();
            var today = DateTime.Today;
            var endDate = today.AddMonths(2);

            var tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Stockholm");

            foreach (var resource in resources)
            {
                var currentDate = today;

                while (currentDate <= endDate)
                {
                    // Skip weekends
                    if (currentDate.DayOfWeek != DayOfWeek.Saturday &&
                        currentDate.DayOfWeek != DayOfWeek.Sunday)
                    {
                        // Define 8am local time
                        var localStart = new DateTime(
                            currentDate.Year,
                            currentDate.Month,
                            currentDate.Day,
                            8, 0, 0,
                            DateTimeKind.Unspecified);

                        var localEnd = localStart.AddHours(10); // 08 → 18

                        // Convert to UTC
                        var startTimeUtc = TimeZoneInfo.ConvertTimeToUtc(localStart, tz);
                        var endTimeUtc = TimeZoneInfo.ConvertTimeToUtc(localEnd, tz);

                        while (startTimeUtc < endTimeUtc)
                        {
                            context.Timeslots.Add(new Timeslot
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

            context.SaveChanges();
        }
    }
}
