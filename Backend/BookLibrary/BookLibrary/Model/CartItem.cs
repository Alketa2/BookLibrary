using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class CartItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid CartId { get; set; }
        public Cart Cart { get; set; } = null!;

        public Guid BookId { get; set; }            
        public Book Book { get; set; } = null!;

        public int Quantity { get; set; }
    }
}
