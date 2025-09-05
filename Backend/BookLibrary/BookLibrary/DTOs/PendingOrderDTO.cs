using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request;

public class PendingOrderDto
{
  public Guid OrderId { get; set; }
    public DateTime OrderDate { get; set; }
    public List<OrderItemDto> Items { get; set; }
     public decimal TotalPrice { get; set; } 
    public string Status { get; set; }
}
