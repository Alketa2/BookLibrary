using LabCourse1.Core.DTOs;
using LabCourse1.Core.Entities;
using LabCourse1.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LabCourse1.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IGenericRepository<Book> _repo;
    public BooksController(IGenericRepository<Book> repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? q, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var query = _repo.Query();
        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(b => b.Title.Contains(q) || b.Author.Contains(q));
        var total = await query.CountAsync();
        var data = await query.OrderBy(b => b.Title).Skip((page-1)*pageSize).Take(pageSize).ToListAsync();
        return Ok(new { total, page, pageSize, data });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var book = await _repo.GetByIdAsync(id);
        return book is null ? NotFound() : Ok(book);
    }

    [Authorize(Roles = nameof(Role.Admin)+","+nameof(Role.Librarian))]
    [HttpPost]
    public async Task<IActionResult> Create(BookCreateDto dto)
    {
        var created = await _repo.AddAsync(new Book {
            Title = dto.Title, Author = dto.Author, Isbn = dto.Isbn,
            Price = dto.Price, Stock = dto.Stock, PublishedOn = dto.PublishedOn
        });
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = nameof(Role.Admin)+","+nameof(Role.Librarian))]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BookUpdateDto dto)
    {
        var book = await _repo.GetByIdAsync(id);
        if (book is null) return NotFound();
        book.Title = dto.Title; book.Author = dto.Author; book.Price = dto.Price; book.Stock = dto.Stock;
        await _repo.SaveChangesAsync();
        return NoContent();
    }

    [Authorize(Roles = nameof(Role.Admin))]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
        => await _repo.DeleteAsync(id) ? NoContent() : NotFound();
}
