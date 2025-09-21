using LabCourse1.Infrastructure.Data;
using LabCourse1.Infrastructure.Repositories;
using LabCourse1.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// EF Core SQL Server
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<JwtTokenService>();

// CORS
builder.Services.AddCors(opt => opt.AddPolicy("frontend", p =>
    p.AllowAnyHeader().AllowAnyMethod().WithOrigins(
        "http://localhost:5173","http://localhost:3000")));

// JWT
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey)) throw new Exception("Jwt:Key is missing.");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// Swagger + JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LabCourse1 API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { scheme, Array.Empty<string>() } });
});

var app = builder.Build();

// Migrate/ensure DB
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Apply migrations & seed minimal data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Books.Any())
    {
        db.Books.AddRange(new[] {
            new LabCourse1.Core.Entities.Book { Title="Clean Code", Author="Robert C. Martin", Isbn="9780132350884", Price=29.99m, Stock=10, PublishedOn=new DateTime(2008,8,1) },
            new LabCourse1.Core.Entities.Book { Title="The Pragmatic Programmer", Author="Andrew Hunt", Isbn="9780201616224", Price=31.50m, Stock=8, PublishedOn=new DateTime(1999,10,30) },
            new LabCourse1.Core.Entities.Book { Title="Design Patterns", Author="GoF", Isbn="9780201633610", Price=39.00m, Stock=5, PublishedOn=new DateTime(1994,10,21) },
        });
        db.SaveChanges();
    }
}

app.MapControllers();

app.Run();
