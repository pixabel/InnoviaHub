using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Backend.Data;
using InnoviaHub.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.OpenApi.Models;
using InnoviaHub.Hubs;
using DotNetEnv;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load();
}

builder.Configuration
    .AddJsonFile("appsettings.Development.json", optional: true)
    .AddEnvironmentVariables();

// Prefer configuration (user-secrets, appsettings, env) and fall back to Environment.GetEnvironmentVariable
var connection = builder.Configuration["AZURE_SQL_CONNECTIONSTRING"] 
                 ?? Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

if (string.IsNullOrWhiteSpace(connection))
{
    throw new Exception("Connection string 'AZURE_SQL_CONNECTIONSTRING' is missing.");
}

builder.Services.AddDbContext<InnoviaHubDB>(options =>
    options.UseSqlServer(connection));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<InnoviaHubDB>()
    .AddDefaultTokenProviders();

// Ensure JWT_SECRET exists and throw a helpful error otherwise
var jwtSecret = builder.Configuration["JWT_SECRET"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrWhiteSpace(jwtSecret))
{
    throw new Exception("Environment variable JWT_SECRET is missing. Set it (e.g. in .env, user-secrets, or system env) before starting the app.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "JwtBearer";
    options.DefaultChallengeScheme = "JwtBearer";
})
.AddJwtBearer("JwtBearer", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(jwtSecret)
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        RoleClaimType = ClaimTypes.Role 
    };
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Skriv 'Bearer' [mellanslag] och sedan din token.\n\nExempel: \"Bearer eyJhbGciOi...\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

string? apiKey = Environment.GetEnvironmentVariable("API_KEY");

// OpenAI Service Registration 
builder.Services.AddHttpClient(); // so IHttpClientFactory is available
builder.Services.AddScoped<OpenAIRecommendationService>();
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AdminUserService>();
builder.Services.AddScoped<AdminBookingService>();
builder.Services.AddScoped<AdminResourceService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddSignalR();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "InnoviaHub API V1");
        options.RoutePrefix = "swagger";
    });

}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// Call the timeslotSeeder
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InnoviaHubDB>();

    // Seed new timeslots
    TimeslotsSeeder.SeedTimeslots(context);
}

// app.UseHttpsRedirection();

app.MapGet("/", () => "Backend is running 🚀");
app.MapControllers();
app.MapHub<BookingHub>("/bookinghub");
app.MapHub<ResourceHub>("/resourcehub");


using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

    // Log environment variable and named connection string
    var az = config["AZURE_SQL_CONNECTIONSTRING"];
    var connStrDefault = config.GetConnectionString("DefaultConnection");
    logger.LogInformation("CONFIG AZURE_SQL_CONNECTIONSTRING: {Az}", az ?? "<null>");
    logger.LogInformation("CONFIG ConnectionStrings:DefaultConnection: {Def}", connStrDefault ?? "<null>");

    // Log actual DB connection string from DbContext
    try
    {
        var db = scope.ServiceProvider.GetService<InnoviaHubDB>();
        if (db != null)
        {
            var connStr = db.Database.GetDbConnection().ConnectionString;
            logger.LogInformation("Connected to DB (Program.cs): {Conn}", connStr);
        }
        else
        {
            logger.LogWarning("InnoviaHubDB service not resolved; cannot log connection string.");
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to read DB connection string");
    }
}


app.Run();