using System.ComponentModel.DataAnnotations;

namespace LabCourse1.Core.Entities;

public class Book
{
    public int Id { get; set; }
    [MaxLength(200)] public string Title { get; set; } = null!;
    [MaxLength(120)] public string Author { get; set; } = null!;
    [MaxLength(13)] public string Isbn { get; set; } = null!;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public DateTime PublishedOn { get; set; }
}
