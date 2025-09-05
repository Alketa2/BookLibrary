using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }        
        public User? User { get; set; }

        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
