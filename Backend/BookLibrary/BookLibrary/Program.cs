using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using MySql.EntityFrameworkCore.Extensions;   // ← (hiqe këtë nëse përdor Pomelo)
using BookLibrary.Data;
using BookLibrary.Services;
using BookLibrary.Services.Email;
using BookLibrary.Model;                      // për UserRoles

var builder = WebApplication.CreateBuilder(args);

// 1) Connection string – përdor "DefaultConnection" nga appsettings.json
var cs = builder.Configuration.GetConnectionString("DefaultConnection");

// 2) DbContext – MySQL
builder.Services.AddDbContext<DatabaseConnection>(options =>
{
    // ZGJEDHJE A: Oracle provider
    options.UseMySQL(cs);

    // ZGJEDHJE B: Pomelo provider (nëse e preferon):
    // options.UseMySql(cs, ServerVersion.AutoDetect(cs));
});

// 3) Shërbimet bazë
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.WithOrigins("http://localhost:5173", "http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// 4) Email/JWT helpers
builder.Services.AddScoped<JwtTokenService>();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<EmailService>();

// 5) JWT Auth
var jwtKey = builder.Configuration["Jwt:Key"] ?? "change-me";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = true
        };
    });

// 6) Authorization policies (kujdes: UserRoles.User = "Member" te modeli yt)
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", p => p.RequireRole(UserRoles.Admin));
    options.AddPolicy("RequireUserRole", p => p.RequireRole(UserRoles.User));   // "Member"
    options.AddPolicy("RequireStaffRole", p => p.RequireRole(UserRoles.Staff));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
