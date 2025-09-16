using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DotNetEnv;

namespace Backend.Data
{
    public class InnoviaHubDbContextFactory : IDesignTimeDbContextFactory<InnoviaHubDB>
    {
        public InnoviaHubDB CreateDbContext(string[] args)
        {
            // Ladda env vid design-time
            Env.Load();

            var connection = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");
            if (string.IsNullOrWhiteSpace(connection))
            {
                throw new Exception("Connection string 'AZURE_SQL_CONNECTIONSTRING' is missing.");
            }

            var optionsBuilder = new DbContextOptionsBuilder<InnoviaHubDB>();
            optionsBuilder.UseSqlServer(connection);

            return new InnoviaHubDB(optionsBuilder.Options);
        }
    }
}