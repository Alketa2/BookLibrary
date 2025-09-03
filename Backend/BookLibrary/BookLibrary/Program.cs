using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore.Extensions; 
using BookLibrary.Data;                     
using BookLibrary.Services;                 
using BookLibrary.Services.Email;           

var builder = WebApplication.CreateBuilder(args);


var cs = builder.Configuration.GetConnectionString("Default");


builder.Services.AddDbContext<DatabaseConnection>(options =>
    options.UseMySQL(cs));


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


builder.Services.AddScoped<JwtTokenService>();
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<EmailService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("frontend");


app.UseAuthorization();

app.MapControllers();
app.Run();
