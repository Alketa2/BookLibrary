namespace LabCourse1.Core.DTOs;

public record OrderCreateDto(int UserId, IReadOnlyList<OrderItemDto> Items);
public record OrderItemDto(int BookId, int Quantity);
