using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Book
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();   

        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        // lidhje me Genre:
        public Guid? GenreId { get; set; }               
        public Genre? Genre { get; set; }

        // lidhja me kategori 
        public ICollection<Category> Categories { get; set; } = new List<Category>();

       
        public decimal Price { get; set; }
        public bool IsOnSale { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public DateTime? DiscountStartDate { get; set; }
        public DateTime? DiscountEndDate { get; set; }

        public decimal GetCurrentPrice()
        {
            if (IsOnSale && DiscountPercentage.HasValue &&
                (!DiscountStartDate.HasValue || DiscountStartDate.Value <= DateTime.UtcNow) &&
                (!DiscountEndDate.HasValue || DiscountEndDate.Value >= DateTime.UtcNow))
            {
                var pct = Math.Clamp((decimal)DiscountPercentage.Value, 0m, 100m);
                return Math.Round(Price * (1 - pct / 100m), 2);
            }
            return Price;
        }
    }
}
