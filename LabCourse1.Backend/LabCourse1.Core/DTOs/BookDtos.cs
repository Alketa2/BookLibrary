namespace LabCourse1.Core.DTOs;

public record BookCreateDto(string Title, string Author, string Isbn, decimal Price, int Stock, DateTime PublishedOn);
public record BookUpdateDto(string Title, string Author, decimal Price, int Stock);
