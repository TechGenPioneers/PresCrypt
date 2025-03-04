using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PresCrypt_Backend.PresCrypt.Core.Models
{
    public class Appointment
    {
        [Key]
        [Required]
        public string AppointmentId { get; set; }  // Primary Key

        [Required]
        public string PatientId { get; set; }  // Assuming this references a Patient table

        [Required]
        public string DoctorId { get; set; }  // Foreign Key referencing Doctor table

        [ForeignKey("DoctorId")]
        public Doctor Doctor { get; set; }  // Navigation Property

        [Required]
        public DateTime Time { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]  // Assuming limited status values like "Pending", "Completed"
        public string Status { get; set; }

        public byte[] SpecialNote { get; set; }  // File stored as a byte array

        [Required]
        [MaxLength(50)]
        public string TypeOfAppointment { get; set; }  // Example: "Consultation", "Surgery"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
