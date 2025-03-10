using PresCrypt_Backend.PresCrypt.Core.Models;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets for your entities
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Hospital> Hospitals { get; set; }
    public DbSet<Doctor_Availability> Doctor_Availability { get; set; } // This is the correct declaration
}
