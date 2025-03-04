using Microsoft.EntityFrameworkCore;
using PresCrypt_Backend.PresCrypt.Core.Models;
using static Azure.Core.HttpHeader;

namespace PresCrypt_Backend.PresCrypt.Infrastructions.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }
        public DbSet<Doctor> Doctor { get; set; }
    }
}