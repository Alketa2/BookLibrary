using Microsoft.EntityFrameworkCore;
using BookLibrary.Model;

namespace BookLibrary.Data
{
    public class BookLibraryDbContext : DbContext
    {
        public BookLibraryDbContext(DbContextOptions<BookLibraryDbContext> options) : base(options) { }

        public DbSet<Book> Books => Set<Book>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Genre> Genres => Set<Genre>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            // Book
            b.Entity<Book>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Price).HasColumnType("decimal(10,2)");
                e.HasIndex(x => x.ISBN).IsUnique();
                e.HasOne(x => x.Genre)
                 .WithMany(g => g.Books)
                 .HasForeignKey(x => x.GenreId)
                 .OnDelete(DeleteBehavior.SetNull);
            });

            // Category
            b.Entity<Category>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.Name).IsUnique();
            });

            // Genre
            b.Entity<Genre>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.Name).IsUnique();
            });

            // Many-to-many Book <-> Category (create join table BookCategory)
            b.Entity<Book>()
                .HasMany(x => x.Categories)
                .WithMany(x => x.Books)
                .UsingEntity<Dictionary<string, object>>(
                    "BookCategory",
                    r => r.HasOne<Category>().WithMany().HasForeignKey("CategoriesId").OnDelete(DeleteBehavior.Cascade),
                    l => l.HasOne<Book>().WithMany().HasForeignKey("BooksId").OnDelete(DeleteBehavior.Cascade),
                    je =>
                    {
                        je.HasKey("BooksId", "CategoriesId");
                        je.ToTable("BookCategory");
                    }
                );

            // Cart / CartItem
            b.Entity<Cart>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasIndex(x => x.UserId);
            });

            b.Entity<CartItem>(e =>
            {
                e.HasKey(x => x.Id);
                e.HasOne(x => x.Cart)
                 .WithMany(c => c.Items)
                 .HasForeignKey(x => x.CartId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne(x => x.Book)
                 .WithMany(bk => bk.CartItems)
                 .HasForeignKey(x => x.BookId)
                 .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}