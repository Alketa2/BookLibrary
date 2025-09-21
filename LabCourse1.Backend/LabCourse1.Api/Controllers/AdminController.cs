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
                o.Id, o.CreatedAt, o.Total,
                User = new { o.User!.Id, o.User.FullName, o.User.Email },
                Items = o.Items.Select(i => new { i.Id, Book = new { i.BookId, i.Book!.Title }, i.Quantity, i.UnitPrice })
            })
            .ToListAsync();
        return Ok(orders);
    }

}
