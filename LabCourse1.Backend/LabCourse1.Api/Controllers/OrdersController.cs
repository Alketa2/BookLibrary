using LabCourse1.Core.DTOs;
using LabCourse1.Core.Entities;
using LabCourse1.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabCourse1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    public OrdersController(AppDbContext db) { _db = db; }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(OrderCreateDto dto)
    {
        var user = await _db.Users.FindAsync(dto.UserId);
        if (user is null) return BadRequest("User not found.");
        var bookIds = dto.Items.Select(i => i.BookId).ToList();
        var books = await _db.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();
        if (books.Count != dto.Items.Count) return BadRequest("Invalid book ID(s).");

        var order = new Order { UserId = user.Id };
        foreach (var item in dto.Items)
        {
            var book = books.First(b => b.Id == item.BookId);
            if (book.Stock < item.Quantity) return BadRequest($"Not enough stock for {book.Title}");
            book.Stock -= item.Quantity;
            order.Items.Add(new OrderItem { BookId = book.Id, Quantity = item.Quantity, UnitPrice = book.Price });
        }
        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Items).ThenInclude(i => i.Book)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id);
        return order is null ? NotFound() : Ok(order);
    }
}
