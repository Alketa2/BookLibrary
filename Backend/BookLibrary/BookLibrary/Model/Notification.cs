using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model
{
    public class Notification
    {
        [Key]
        public Guid NotificationId { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required, StringLength(500)]
        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }
}
