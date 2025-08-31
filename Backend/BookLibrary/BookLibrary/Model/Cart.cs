using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Cart
    {
        public int Id { get; set; }

        [Required, MaxLength(128)]
        public string UserId { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}