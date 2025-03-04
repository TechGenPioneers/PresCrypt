using System.ComponentModel.DataAnnotations;

namespace PresCrypt_Backend.PresCrypt.Core.Models
{
    public class Doctor
    {
        [Key]
        [Required]
        public string DoctorId { get; set; }  // Primary Key

        [Required]
        [MaxLength(100)]
        public string DoctorName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string Specialization { get; set; }

        [Required]
        [MaxLength(50)]
        public string SLMCRegId { get; set; }  // SLMC Registration ID

        public byte[] Id { get; set; }  // Image stored as a byte array

        [Required]
        public long NIC { get; set; }  // Assuming NIC as a numeric value (long)

        [Required]
        public bool EmailVerified { get; set; }

        [Required]
        [MaxLength(50)]
        public string Role { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; }  // Store hashed password

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }  // Active/Inactive

        public DateTime? LastLogin { get; set; }

    }
}
