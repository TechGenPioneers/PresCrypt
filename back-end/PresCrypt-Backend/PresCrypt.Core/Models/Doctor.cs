using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PresCrypt_Backend.PresCrypt.Core.Models
{
    public class Doctor
    {
        internal object Hospitals;

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
        public string Role { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Default to current UTC time

        public DateTime? UpdatedAt { get; set; }  // Nullable, since it may not always be updated

        [Required]
        public string PasswordHash { get; set; }  // Storing hashed password

        [Required]
        [MaxLength(20)]
        public string Status { get; set; }  // Active, Inactive, etc.

        public DateTime? LastLogin { get; set; }  // Nullable, as it may not always be available

        // Navigation Property
        public ICollection<Doctor_Availability> Availabilities { get; set; }
    }
}
