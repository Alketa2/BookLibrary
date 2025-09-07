using LabCourse1.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace LabCourse1.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>().HasIndex(u => u.Email).IsUnique();
        b.Entity<Book>().HasIndex(x => x.Isbn).IsUnique();
        b.Entity<Book>().HasIndex(x => new { x.Author, x.Title });
        b.Entity<OrderItem>().HasIndex(x => new { x.OrderId, x.BookId }).IsUnique();

        b.Entity<OrderItem>()
            .HasOne(oi => oi.Book)
            .WithMany()
            .HasForeignKey(oi => oi.BookId)
            .OnDelete(DeleteBehavior.Restrict);

        b.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId);

        // Seed minimal data for testing
        b.Entity<Book>().HasData(
            new Book { Id = 1, Title = "Clean Code", Author = "Robert C. Martin", Isbn = "9780132350884", Price = 35, Stock = 10, PublishedOn = new DateTime(2008,8,1) },
            new Book { Id = 2, Title = "The Pragmatic Programmer", Author = "Andrew Hunt", Isbn = "9780201616224", Price = 30, Stock = 7, PublishedOn = new DateTime(1999,10,30) }
        );
    }
}
