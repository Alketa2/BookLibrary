using Microsoft.EntityFrameworkCore;
using BookLibrary.Model;

namespace BookLibrary.Data
{
    public class DatabaseConnection : DbContext
    {
        public DatabaseConnection(DbContextOptions<DatabaseConnection> options) : base(options) { }

        public DbSet<User> Users { get; set; } = default!;
        public DbSet<Book> Books { get; set; } = default!;
        public DbSet<Order> Orders { get; set; } = default!;
        public DbSet<OrderItem> OrderItems { get; set; } = default!;
        public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<Category> Categories { get; set; } = default!;
        public DbSet<Genre> Genres { get; set; } = default!;
        public DbSet<Cart> Carts { get; set; } = default!;
        public DbSet<CartItem> CartItems { get; set; } = default!;
        public DbSet<WhiteList> WhiteLists { get; set; } = default!;
        public DbSet<Notification> Notifications { get; set; } = default!; // e re

    }
    }
