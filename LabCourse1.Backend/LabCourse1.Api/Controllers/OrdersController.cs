using System.Linq;
using System.Threading.Tasks;
using LabCourse1.Core.DTOs;
using LabCourse1.Core.Entities;
using LabCourse1.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LabCourse1.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;
        public OrdersController(AppDbContext db) { _db = db; }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto req)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (req == null)
                return BadRequest("Body is required");

            if (req.Items == null || req.Items.Count == 0)
                return BadRequest("Cart is empty");

            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier) ??
                User.FindFirst("nameid") ??
                User.FindFirst("sub") ??
                User.FindFirst("id");

            if (userIdClaim == null)
                return Unauthorized("User claim not found");

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized("Invalid user id claim");

            var ids = req.Items.Select(i => i.BookId).ToList();
            var books = await _db.Books.Where(b => ids.Contains(b.Id)).ToListAsync();
            if (books.Count != ids.Count)
                return BadRequest("Some items not found");

            var order = new Order
            {
                UserId = userId,
                FirstName = req.FirstName.Trim(),
                LastName = req.LastName.Trim(),
                Phone = req.Phone.Trim(),
                Address = req.Address.Trim(),
                City = req.City.Trim(),
                PostalCode = req.PostalCode.Trim(),
                PaymentMethod = req.PaymentMethod,
                ShippingMethod = req.ShippingMethod,
                Status = OrderStatus.Paid
            };

            decimal subtotal = 0m;

            foreach (var item in req.Items)
            {
                if (item.Quantity <= 0)
                    return BadRequest("Invalid quantity");

                var book = books.First(b => b.Id == item.BookId);
                if (book.Stock < item.Quantity)
                    return BadRequest($"Not enough stock for {book.Title}");

                book.Stock -= item.Quantity;

                var unit = book.Price;
                order.Items.Add(new OrderItem
                {
                    BookId = book.Id,
                    Quantity = item.Quantity,
                    UnitPrice = unit
                });

                subtotal += unit * item.Quantity;
            }

            order.Subtotal = subtotal;
            order.ShippingCost = req.ShippingMethod == ShippingMethod.Fast ? 4.99m : 2.99m;
            order.Total = order.Subtotal + order.ShippingCost;

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

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> List()
        {
            var orders = await _db.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Book)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
            return Ok(orders);
        }
    }
}
