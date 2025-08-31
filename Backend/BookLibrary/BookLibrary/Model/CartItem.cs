using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;

        public int BookId { get; set; }
        public Book Book { get; set; } = null!;

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
    }
}