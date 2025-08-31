using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model
{
    public class Genre
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;
        public ICollection<Book> Books { get; set; } = new List<Book>();
    }
}