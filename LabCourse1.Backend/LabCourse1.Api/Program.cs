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
builder.Services
    .AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        // o.JsonSerializerOptions.PropertyNamingPolicy = null; // leave default
    });

// EF Core SQL Server
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DI
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<JwtTokenService>();

// CORS (frontend dev ports)
builder.Services.AddCors(opt => opt.AddPolicy("frontend", p =>
    p.AllowAnyHeader()
     .AllowAnyMethod()
     .WithOrigins("http://localhost:5173", "http://localhost:3000")
     .AllowCredentials()));

// JWT configuration (validation)
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new Exception("Jwt:Key is missing.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.RequireHttpsMetadata = false; // OK for local dev
        o.SaveToken = true;
        o.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };

        // ===== Diagnostic logging for 401s =====
        o.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = ctx =>
            {
                Console.WriteLine("[JWT] Authentication failed: " + ctx.Exception.Message);
                if (ctx.Exception.InnerException != null)
                    Console.WriteLine("[JWT] Inner: " + ctx.Exception.InnerException.Message);
                return Task.CompletedTask;
            },
            OnChallenge = ctx =>
            {
                // Triggers when auth fails and a 401 is about to be returned
                Console.WriteLine("[JWT] Challenge: " + ctx.ErrorDescription);
                return Task.CompletedTask;
            },
            OnMessageReceived = ctx =>
            {
                // Useful to confirm header is actually present
                var hasAuth = ctx.Request.Headers.ContainsKey("Authorization");
                Console.WriteLine($"[JWT] Authorization header present: {hasAuth}");
                return Task.CompletedTask;
            },
            OnTokenValidated = ctx =>
            {
                Console.WriteLine("[JWT] Token validated OK.");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Swagger + JWT support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LabCourse1 API", Version = "v1" });

    // Define the "Bearer" scheme
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT in the Authorization header. Example: Bearer eyJhbGciOiJIUzI1NiIs...",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,   // <— important for some Swashbuckle versions
        Scheme = "Bearer"
    });

    // Require it globally (applies to all operations)
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
            Array.Empty<string>()
        }
    });
});


var app = builder.Build();

// ===== Echo effective JWT config at startup (helps spot env/config mismatches) =====
Console.WriteLine($"[CFG] Jwt:Issuer   = {jwtIssuer}");
Console.WriteLine($"[CFG] Jwt:Audience = {jwtAudience}");
Console.WriteLine($"[CFG] Jwt:Key(head)= {jwtKey?.Substring(0, Math.Min(jwtKey.Length, 8))}********");

// Apply migrations + seed sample data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Books.Any())
    {
        db.Books.AddRange(new[]
        {
            new LabCourse1.Core.Entities.Book { Title="Clean Code", Author="Robert C. Martin", Isbn="9780132350884", Price=29.99m, Stock=10, PublishedOn=new DateTime(2008,8,1) },
            new LabCourse1.Core.Entities.Book { Title="The Pragmatic Programmer", Author="Andrew Hunt", Isbn="9780201616224", Price=31.50m, Stock=8, PublishedOn=new DateTime(1999,10,30) },
            new LabCourse1.Core.Entities.Book { Title="Design Patterns", Author="GoF", Isbn="9780201633610", Price=39.00m, Stock=5, PublishedOn=new DateTime(1994,10,21) },
        });
        db.SaveChanges();
    }
}

// Middleware order is critical
app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
