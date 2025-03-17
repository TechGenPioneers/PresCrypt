using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PresCrypt_Backend.PresCrypt.Core.Models
{
    public class Hospital
    {
        [Key]
        [Required]
        public string HospitalId { get; set; }  // Primary Key

        [Required]
        [MaxLength(100)]
        public string HospitalName { get; set; }  // Name of the hospital

        [Required]
        [MaxLength(15)]
        public string Number { get; set; }  // Phone number or contact number

        [Required]
        [MaxLength(255)]
        public string Address { get; set; }  // Address of the hospital

        [Required]
        [MaxLength(100)]
        public string City { get; set; }  // City where the hospital is located

        // Foreign Key to Doctor table
        [Required]
        public string DoctorId { get; set; }  // Foreign Key property

        // Navigation Property for the Doctor relationship
        [ForeignKey("DoctorId")]
        public Doctor Doctorid{ get; set; }  // Navigation property to the Doctor class
    }
}
