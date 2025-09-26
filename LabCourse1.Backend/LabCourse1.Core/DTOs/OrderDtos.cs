using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LabCourse1.Core.Entities;

namespace LabCourse1.Core.DTOs
{
    public class OrderItemDto
    {
        [Range(1, int.MaxValue)]
        public int BookId { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class OrderCreateDto
    {
        [Required, MinLength(1)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MinLength(1)]
        public string LastName { get; set; } = string.Empty;

        [Required, MinLength(1)]
        public string Phone { get; set; } = string.Empty;

        [Required, MinLength(1)]
        public string Address { get; set; } = string.Empty;

        [Required, MinLength(1)]
        public string City { get; set; } = string.Empty;

        [Required, MinLength(1)]
        public string PostalCode { get; set; } = string.Empty;

        [Required]
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;

        [Required]
        public ShippingMethod ShippingMethod { get; set; } = ShippingMethod.Standard;

        [Required, MinLength(1)]
        public List<OrderItemDto> Items { get; set; } = new();
    }
}
