using LabCourse1.Core.DTOs;
using LabCourse1.Core.Entities;
using LabCourse1.Infrastructure.Data;
using LabCourse1.Infrastructure.Repositories;
using LabCourse1.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabCourse1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _jwt;
    public AuthController(AppDbContext db, JwtTokenService jwt) { _db = db; _jwt = jwt; }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict("Email already exists.");
        var user = new User {
            FullName = req.FullName,
            Email = req.Email,
            PasswordHash = PasswordHasher.Hash(req.Password),
            Role = Role.User
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        var token = _jwt.CreateToken(user);
        return Ok(new AuthResponse(token, user.FullName, user.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null || !PasswordHasher.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");
        var token = _jwt.CreateToken(user);
        return Ok(new AuthResponse(token, user.FullName, user.Role.ToString()));
    }
}
