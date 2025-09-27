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
        
// Validate required fields
if (string.IsNullOrWhiteSpace(req.FullName) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
    return BadRequest("TE DHENAT NUK JANE PLOTESUAR");
// Enforce unique email
if (await _db.Users.AnyAsync(u => u.Email == req.Email))
    return Conflict("KJO EMAIL VEQ SE ESHTE PERDORUR , PERDORNI NJE EMAIL TJETER");
if (await _db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict("Email already in use.");
        var user = new User
        {
            FullName = req.FullName,
            Email = req.Email,
            Role = Role.User,
            PasswordHash = PasswordHasher.Hash(req.Password)
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var access = _jwt.CreateToken(user);
        await IssueRefreshTokenAsync(user);
        return Ok(new AuthResponse(access, user.FullName, user.Role.ToString()));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
                if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password)) return BadRequest("TE DHENAT NUK JANE PLOTESUAR");
var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user is null || !PasswordHasher.Verify(req.Password, user.PasswordHash))
            return Unauthorized("Invalid credentials.");
        var access = _jwt.CreateToken(user);
        await IssueRefreshTokenAsync(user);
        return Ok(new AuthResponse(access, user.FullName, user.Role.ToString()));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> Refresh()
    {
        var token = Request.Cookies["rt"];
        if (string.IsNullOrWhiteSpace(token)) return Unauthorized();
        var entry = await _db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == token);
        if (entry is null || !entry.IsActive) return Unauthorized();

        // rotate
        entry.RevokedAt = DateTime.UtcNow;
        var user = entry.User!;
        await IssueRefreshTokenAsync(user);

        var access = _jwt.CreateToken(user);
        return Ok(new { accessToken = access });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Cookies["rt"];
        if (!string.IsNullOrEmpty(token))
        {
            var entry = await _db.RefreshTokens.FirstOrDefaultAsync(r => r.Token == token);
            if (entry != null) { entry.RevokedAt = DateTime.UtcNow; await _db.SaveChangesAsync(); }
        }
        Response.Cookies.Delete("rt");
        return NoContent();
    }

    private async Task IssueRefreshTokenAsync(User user)
    {
        // revoke existing active tokens for this user to simplify
        var active = await _db.RefreshTokens.Where(r => r.UserId == user.Id && r.RevokedAt == null && r.ExpiresAt > DateTime.UtcNow).ToListAsync();
        foreach (var a in active) a.RevokedAt = DateTime.UtcNow;

        var rt = new RefreshToken { UserId = user.Id, Token = Guid.NewGuid().ToString("N"), ExpiresAt = DateTime.UtcNow.AddDays(7) };
        _db.RefreshTokens.Add(rt);
        await _db.SaveChangesAsync();

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false, // set true if using HTTPS
            SameSite = SameSiteMode.Lax,
            Expires = rt.ExpiresAt
        };
        Response.Cookies.Append("rt", rt.Token, cookieOptions);
    }
}
