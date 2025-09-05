using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}
