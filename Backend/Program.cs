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
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using InnoviaHub.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables in development
if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load();
}

// Configuration
builder.Configuration
       .AddJsonFile("appsettings.Development.json", optional: true)
       .AddEnvironmentVariables();

// Get DB connection string
var connection = builder.Configuration["AZURE_SQL_CONNECTIONSTRING"] 
                 ?? Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

if (string.IsNullOrWhiteSpace(connection))
{
    throw new Exception("Connection string 'AZURE_SQL_CONNECTIONSTRING' is missing.");
}

// DbContext & Identity
builder.Services.AddDbContext<InnoviaHubDB>(options =>
    options.UseSqlServer(connection));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<InnoviaHubDB>()
    .AddDefaultTokenProviders();

// JWT Secret
var jwtSecret = builder.Configuration["JWT_SECRET"]
                ?? Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrWhiteSpace(jwtSecret))
{
    throw new Exception("Environment variable JWT_SECRET is missing.");
}

// JWT Authentication (with SignalR querystring token support)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        RoleClaimType = ClaimTypes.Role
    };

    // Allow retrieving access token from query string for SignalR WebSocket requests
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"].ToString();
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/bookinghub") || path.StartsWithSegments("/resourcehub")))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Read frontend origin and credential flag from environment
var frontendOrigin = builder.Configuration["FRONTEND_ORIGIN"]
                     ?? Environment.GetEnvironmentVariable("FRONTEND_ORIGIN")
                     ?? "https://innoviahub-8him5.ondigitalocean.app";

var allowCredentials = (builder.Configuration["FRONTEND_ALLOW_CREDENTIALS"]
                       ?? Environment.GetEnvironmentVariable("FRONTEND_ALLOW_CREDENTIALS")
                       ?? "true").ToLower() == "true";

// Support multiple origins separated by , or ; (optional)
var origins = frontendOrigin.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => s.Trim())
                            .ToArray();

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp", policy =>
    {
        if (origins.Length == 1 && origins[0] == "*")
        {
            // No credentials allowed with wildcard
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(origins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();

            if (allowCredentials)
            {
                policy.AllowCredentials();
            }
        }
    });
});

// Swagger (kept commented out in your original)
// builder.Services.AddSwaggerGen(...);

// OpenAI Service
builder.Services.AddHttpClient();
builder.Services.AddScoped<OpenAIRecommendationService>();

// App Services
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

// Swagger
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "InnoviaHub API V1");
        options.RoutePrefix = "swagger";
    });
}

app.UseRouting();

// Apply the named CORS policy BEFORE authentication/authorization and before MapHub
app.UseCors("AllowWebApp");

app.UseAuthentication();
app.UseAuthorization();

// Seed timeslots safely
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InnoviaHubDB>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        TimeslotsSeeder.SeedTimeslots(context);
        logger.LogInformation("Timeslots seeded successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to seed timeslots.");
    }

    try
    {
        var connStr = context.Database.GetDbConnection().ConnectionString;
        logger.LogInformation("Connected to DB: {Conn}", connStr);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to read DB connection string.");
    }
}

app.MapGet("/", () => "Backend is running 🚀");
app.MapGet("/health", () => Results.Ok("Healthy"));
app.MapControllers();

app.MapHub<BookingHub>("/bookinghub").RequireCors("AllowWebApp");
app.MapHub<ResourceHub>("/resourcehub").RequireCors("AllowWebApp");

var loggerMain = app.Services.GetRequiredService<ILogger<Program>>();
app.Run();