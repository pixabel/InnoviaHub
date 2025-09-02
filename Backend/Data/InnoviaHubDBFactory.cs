using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using Backend.Data;

namespace Backend.Data
{
    public class InnoviaHubDBFactory : IDesignTimeDbContextFactory<InnoviaHubDB>
    {
        public InnoviaHubDB CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = configuration.GetValue<string>("AZURE_SQL_CONNECTIONSTRING");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new Exception("Missing connection string 'AZURE_SQL_CONNECTIONSTRING'.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<InnoviaHubDB>();
            optionsBuilder.UseSqlServer(connectionString);

            return new InnoviaHubDB(optionsBuilder.Options);
        }
    }
}