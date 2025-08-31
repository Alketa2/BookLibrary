using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Book
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required, MaxLength(150)]
        public string Author { get; set; } = null!;

        [MaxLength(20)]
        public string? ISBN { get; set; } 

        public int? PublishedYear { get; set; }

        public decimal? Price { get; set; } // decimal(10,2)

        public int Stock { get; set; } = 0;

 
        public int? GenreId { get; set; }
        public Genre? Genre { get; set; }

     
        public ICollection<Category> Categories { get; set; } = new List<Category>();

        // for carts 
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}