using LabCourse1.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabCourse1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    public AdminController(AppDbContext db) { _db = db; }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var orders = await _db.Orders.CountAsync();
        var books = await _db.Books.CountAsync();
        var users = await _db.Users.CountAsync();
        return Ok(new { orders, books, users });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _db.Users
            .OrderByDescending(u => u.Id)
            .Select(u => new { u.Id, u.FullName, u.Email, Role = u.Role.ToString(), u.CreatedAt })
            .ToListAsync();
        return Ok(users);
    }

    [HttpGet("books")]
    public async Task<IActionResult> GetBooks()
    {
        var books = await _db.Books
            .OrderByDescending(b => b.Id)
            .Select(b => new { b.Id, b.Title, b.Author, b.Isbn, b.Price, b.Stock, b.PublishedOn })
            .ToListAsync();
        return Ok(books);
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items).ThenInclude(i => i.Book)
            .OrderByDescending(o => o.Id)
            .Select(o => new { 
                o.Id, o.CreatedAt, o.Subtotal, o.ShippingCost, o.Total,
                o.FirstName, o.LastName, o.Phone, o.Address, o.City, o.PostalCode,
                PaymentMethod = o.PaymentMethod.ToString(),
                ShippingMethod = o.ShippingMethod.ToString(),
                User = new { o.User!.Id, o.User.FullName, o.User.Email },
                Items = o.Items.Select(i => new { i.Id, Book = new { i.BookId, i.Book!.Title }, i.Quantity, i.UnitPrice })
            })
            .ToListAsync();
        return Ok(orders);
    }


    public class UserUpdateDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; } // "Admin" | "Librarian" | "User"
    }

    [HttpPut("users/{id:int}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.FullName)) user.FullName = dto.FullName!.Trim();
        if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email!.Trim();

        if (!string.IsNullOrWhiteSpace(dto.Role))
        {
            if (Enum.TryParse<LabCourse1.Core.Entities.Role>(dto.Role, true, out var parsed))
                user.Role = parsed;
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("users/{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user is null) return NotFound();
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }

}
