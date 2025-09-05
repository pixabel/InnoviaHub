using Microsoft.AspNetCore.Identity; 
using Microsoft.EntityFrameworkCore;
using Backend.Services;
using Backend.Data;
using InnoviaHub.Models;
using Backend.Controllers;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    DotNetEnv.Env.Load();
}

builder.Configuration
    .AddJsonFile("appsettings.Development.json", optional: true)
    .AddEnvironmentVariables();

var connection = Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

if (string.IsNullOrWhiteSpace(connection))
{
    throw new Exception("Connection string 'AZURE_SQL_CONNECTIONSTRING' is missing.");
}

builder.Services.AddDbContext<InnoviaHubDB>(options =>
    options.UseSqlServer(connection));

builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<InnoviaHubDB>()
    .AddDefaultTokenProviders();

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
            Encoding.ASCII.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET")!)
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        RoleClaimType = ClaimTypes.Role // 👈 viktigt
    };
});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend", Version = "v1" });

    // Lägg till JWT Bearer Auth
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

builder.Services.AddSingleton<BookingService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "InnoviaHub API V1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "Hello world!");

// //users

// app.MapGet("/users", (InnoviaHubDB db) => db.User.ToList());

// app.MapPost("/users", async ([FromBody] User user, InnoviaHubDB db) =>
// {
//     db.User.Add(user);
//     await db.SaveChangesAsync();
//     return Results.Created($"/users/{user.UserId}", user);
// });

// //Resources

// app.MapGet("/resources", (InnoviaHubDB db) => db.Resource.ToList());

// app.MapPost("/resources", async ([FromBody] Resource resource, InnoviaHubDB db) =>
// {
//     db.Resource.Add(resource);
//     await db.SaveChangesAsync();
//     return Results.Created($"/resources/{resource.ResourceId}", resource);
// });

// //Bookings

// app.MapGet("/bookings", (InnoviaHubDB db) =>
//     db.Booking
//       .Include(b => b.UserId)
//       .Include(b => b.ResourceId)
//       .ToList());

// app.MapPost("/bookings", async ([FromBody] Booking booking, InnoviaHubDB db) =>
// {
//     db.Booking.Add(booking);
//     await db.SaveChangesAsync();
//     return Results.Created($"/bookings/{booking.BookingId}", booking);
// });

app.Run();

//public class Person
//{
//    public int Id { get; set; }
//    public string FirstName { get; set; }
//    public string LastName { get; set; }
//}

//public class PersonDbContext : DbContext
//{
//    public PersonDbContext(DbContextOptions<PersonDbContext> options)
//        : base(options)
//    {
//    }
//
//    public DbSet<Person> Person { get; set; }
//}