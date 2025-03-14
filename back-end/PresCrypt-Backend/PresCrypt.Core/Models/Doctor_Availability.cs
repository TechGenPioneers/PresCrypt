using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PresCrypt_Backend.PresCrypt.Core.Models
{
    public class Doctor_Availability
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AvailabilityId { get; set; }

        [Required]
        [ForeignKey("Doctor")]
        public string DoctorId { get; set; }  // Foreign Key referencing Doctor

        [Required]
        public DateOnly AvailableDate { get; set; }  // Stores only Date

        [Required]
        public TimeOnly AvailableTime { get; set; }  // Stores only Time

        // Navigation Property
        public Doctor Doctor { get; set; }
    }
}
