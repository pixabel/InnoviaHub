using Microsoft.AspNetCore.Mvc;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Backend.Services;

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

builder.Services.AddDbContext<PersonDbContext>(options =>
    options.UseSqlServer(connection));
    
builder.Services.AddSingleton<BookingService>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

app.MapGet("/", () => "Hello world!");

app.MapGet("/Person", (PersonDbContext context) =>
{
    return Results.Ok(context.Person.ToList());
});

app.MapPost("/Person", ([FromBody] Person person, PersonDbContext context) =>
{
    context.Person.Add(person);
    context.SaveChanges();
    return Results.Created($"/Person/{person.Id}", person);
});

app.Run();

public class Person
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
}

public class PersonDbContext : DbContext
{
    public PersonDbContext(DbContextOptions<PersonDbContext> options)
        : base(options)
    {
    }

    public DbSet<Person> Person { get; set; }
}