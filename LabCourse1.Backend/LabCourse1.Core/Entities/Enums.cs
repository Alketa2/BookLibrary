namespace LabCourse1.Core.Entities
{
    public enum PaymentMethod { CashOnDelivery = 0, Card = 1 }
    public enum ShippingMethod { Standard = 0, Fast = 1 }
    public enum OrderStatus { Pending = 0, Paid = 1, Shipped = 2, Completed = 3, Cancelled = 4 }
}