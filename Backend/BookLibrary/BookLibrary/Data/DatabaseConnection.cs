using Microsoft.EntityFrameworkCore;
using BookLibrary.Models; 

namespace BookLibrary.Data
{
    public class DatabaseConnection : DbContext
    {
        public DatabaseConnection(DbContextOptions<DatabaseConnection> options) : base(options) { }

        
        public DbSet<User>? Users { get; set; }
        public DbSet<Book>? Books { get; set; }
        public DbSet<Order>? Orders { get; set; }
        public DbSet<WhiteList>? WhiteLists { get; set; }
        public DbSet<Staff>? Staffs { get; set; }
        public DbSet<Category>? Categories { get; set; }
    }
}
