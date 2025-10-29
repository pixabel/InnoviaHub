// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore;
// using Backend.Services;
// using Backend.Data;
// using InnoviaHub.Models;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using System.Security.Claims;
// using Microsoft.OpenApi.Models;
// using InnoviaHub.Hubs;
// using DotNetEnv;
// using Microsoft.Extensions.Configuration;
// using Microsoft.AspNetCore.Authentication.JwtBearer;

// var builder = WebApplication.CreateBuilder(args);

// if (builder.Environment.IsDevelopment())
// {
//     DotNetEnv.Env.Load();
// }

// builder.Configuration
//     .AddJsonFile("appsettings.Development.json", optional: true)
//     .AddEnvironmentVariables();

// // Prefer configuration (user-secrets, appsettings, env) and fall back to Environment.GetEnvironmentVariable
// var connection = builder.Configuration["AZURE_SQL_CONNECTIONSTRING"] 
//                  ?? Environment.GetEnvironmentVariable("AZURE_SQL_CONNECTIONSTRING");

// if (string.IsNullOrWhiteSpace(connection))
// {
//     throw new Exception("Connection string 'AZURE_SQL_CONNECTIONSTRING' is missing.");
// }

// builder.Services.AddDbContext<InnoviaHubDB>(options =>
//     options.UseSqlServer(connection));

// builder.Services.AddIdentity<User, IdentityRole>()
//     .AddEntityFrameworkStores<InnoviaHubDB>()
//     .AddDefaultTokenProviders();

// // Ensure JWT_SECRET exists and throw a helpful error otherwise
// var jwtSecret = builder.Configuration["JWT_SECRET"]
//                 ?? Environment.GetEnvironmentVariable("JWT_SECRET");
// if (string.IsNullOrWhiteSpace(jwtSecret))
// {
//     throw new Exception("Environment variable JWT_SECRET is missing. Set it (e.g. in .env, user-secrets, or system env) before starting the app.");
// }

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = "JwtBearer";
//     options.DefaultChallengeScheme = "JwtBearer";
// })
// .AddJwtBearer("JwtBearer", options =>
// {
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(
//             Encoding.ASCII.GetBytes(jwtSecret)
//         ),
//         ValidateIssuer = false,
//         ValidateAudience = false,
//         RoleClaimType = ClaimTypes.Role 
//     };
// });

// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         policy.AllowAnyOrigin()
//               .AllowAnyHeader()
//               .AllowAnyMethod();
//     });
// });

// builder.Services.AddSwaggerGen(c =>
// {
//     c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend", Version = "v1" });

//     c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         Name = "Authorization",
//         Type = SecuritySchemeType.ApiKey,
//         Scheme = "Bearer",
//         BearerFormat = "JWT",
//         In = ParameterLocation.Header,
//         Description = "Skriv 'Bearer' [mellanslag] och sedan din token.\n\nExempel: \"Bearer eyJhbGciOi...\""
//     });

//     c.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference
//                 {
//                     Type = ReferenceType.SecurityScheme,
//                     Id = "Bearer"
//                 }
//             },
//             new string[] {}
//         }
//     });
// });

// string? apiKey = Environment.GetEnvironmentVariable("API_KEY");

// // OpenAI Service Registration 
// builder.Services.AddHttpClient(); // so IHttpClientFactory is available
// builder.Services.AddScoped<OpenAIRecommendationService>();
// builder.Configuration.AddEnvironmentVariables();

// builder.Services.AddScoped<BookingService>();
// builder.Services.AddScoped<AuthService>();
// builder.Services.AddScoped<AdminUserService>();
// builder.Services.AddScoped<AdminBookingService>();
// builder.Services.AddScoped<AdminResourceService>();
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddAuthorization();
// builder.Services.AddSignalR();

// var app = builder.Build();

// if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI(options =>
//     {
//         options.SwaggerEndpoint("/swagger/v1/swagger.json", "InnoviaHub API V1");
//         options.RoutePrefix = "swagger";
//     });

// }

// app.UseCors();

// app.UseAuthentication();
// app.UseAuthorization();

// // Call the timeslotSeeder
// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<InnoviaHubDB>();

//     // Seed new timeslots
//     TimeslotsSeeder.SeedTimeslots(context);
// }

// // app.UseHttpsRedirection();

// app.MapGet("/", () => "Backend is running 🚀");
// app.MapControllers();
// app.MapHub<BookingHub>("/bookinghub");
// app.MapHub<ResourceHub>("/resourcehub");


// using (var scope = app.Services.CreateScope())
// {
//     var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
//     var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();

//     // Log environment variable and named connection string
//     var az = config["AZURE_SQL_CONNECTIONSTRING"];
//     var connStrDefault = config.GetConnectionString("DefaultConnection");
//     logger.LogInformation("CONFIG AZURE_SQL_CONNECTIONSTRING: {Az}", az ?? "<null>");
//     logger.LogInformation("CONFIG ConnectionStrings:DefaultConnection: {Def}", connStrDefault ?? "<null>");

//     // Log actual DB connection string from DbContext
//     try
//     {
//         var db = scope.ServiceProvider.GetService<InnoviaHubDB>();
//         if (db != null)
//         {
//             var connStr = db.Database.GetDbConnection().ConnectionString;
//             logger.LogInformation("Connected to DB (Program.cs): {Conn}", connStr);
//         }
//         else
//         {
//             logger.LogWarning("InnoviaHubDB service not resolved; cannot log connection string.");
//         }
//     }
//     catch (Exception ex)
//     {
//         logger.LogError(ex, "Failed to read DB connection string");
//     }
// }

// var port = int.TryParse(Environment.GetEnvironmentVariable("PORT"), out var p) ? p : 5271;
// app.Urls.Add($"http://0.0.0.0:{port}");

// // Optional health endpoint
// app.MapGet("/health", () => Results.Ok("Healthy"));

// app.Run();
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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

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

// CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWebApp", policy =>
    {
        if (frontendOrigin == "*")
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
        else
        {
            policy.WithOrigins(frontendOrigin).AllowAnyHeader().AllowAnyMethod();
            if (allowCredentials) policy.AllowCredentials();
        }
    });
});

// Swagger
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

// ===== TEMP DEBUG MIDDLEWARE (deploy temporarily) =====
// This will log incoming OPTIONS requests and inject CORS headers if missing.
// Remove this block when you've confirmed preflight responses include Access-Control-Allow-Origin.
app.Use(async (context, next) =>
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();

    if (context.Request.Method == HttpMethods.Options)
    {
        logger.LogInformation("DEBUG OPTIONS hit: {Path} Origin: {Origin}", context.Request.Path, context.Request.Headers["Origin"].ToString());

        // If ACAO not present, add headers and short-circuit
        if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
        {
            var originHeader = frontendOrigin == "*" ? "*" : frontendOrigin;
            context.Response.Headers["Access-Control-Allow-Origin"] = originHeader;
            context.Response.Headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
            context.Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
            if (allowCredentials) context.Response.Headers["Access-Control-Allow-Credentials"] = "true";

            context.Response.StatusCode = StatusCodes.Status204NoContent;
            return;
        }
    }

    // For non-OPTIONS requests, ensure ACAO is present for debugging (helps the browser accept responses)
    if (!context.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
    {
        context.Response.OnStarting(() =>
        {
            try
            {
                var originHeader = frontendOrigin == "*" ? "*" : frontendOrigin;
                context.Response.Headers["Access-Control-Allow-Origin"] = originHeader;
                if (allowCredentials) context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
            }
            catch { /* swallowing exceptions in debug middleware */ }
            return Task.CompletedTask;
        });
    }

    await next();
});
// ===== END DEBUG MIDDLEWARE =====

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

var port = int.TryParse(Environment.GetEnvironmentVariable("PORT"), out var p) ? p : 5271;
app.Urls.Add($"http://0.0.0.0:{port}");

var loggerMain = app.Services.GetRequiredService<ILogger<Program>>();
loggerMain.LogInformation("App listening on port {Port}", port);

app.Run();