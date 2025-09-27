namespace LabCourse1.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }

// Checkout details
public string FirstName { get; set; } = string.Empty;
public string LastName  { get; set; } = string.Empty;
public string Phone     { get; set; } = string.Empty;
public string Address   { get; set; } = string.Empty;
public string City      { get; set; } = string.Empty;
public string PostalCode { get; set; } = string.Empty;

public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
public ShippingMethod ShippingMethod { get; set; } = ShippingMethod.Standard;
public OrderStatus Status { get; set; } = OrderStatus.Paid;

public decimal Subtotal { get; set; }
public decimal ShippingCost { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public int BookId { get; set; }
    public Book? Book { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
