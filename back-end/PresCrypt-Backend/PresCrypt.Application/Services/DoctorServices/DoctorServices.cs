using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PresCrypt_Backend.PresCrypt.Application.Services.DoctorServices;
using PresCrypt_Backend.PresCrypt.Core.Models;

namespace PresCrypt_Backend.PresCrypt.Application.Services.DoctorServices
{
    public class DoctorServices : IDoctorService
    {
        private readonly ApplicationDbContext _context;

        public DoctorServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DoctorSearchDto>> GetDoctorAsync(string specialization, string hospitalName)
        {
            var query = _context.Doctors.AsQueryable();

            if (!string.IsNullOrEmpty(specialization))
            {
                query = query.Where(d => d.Specialization.Contains(specialization));
            }

            if (!string.IsNullOrEmpty(hospitalName))
            {
                query = query.Where(d =>
                    _context.Hospitals.Any(h => h.HospitalName.Contains(hospitalName) && h.DoctorId == d.DoctorId));
            }

            var doctors = await query
                .Select(d => new DoctorSearchDto
                {
                    DoctorName = d.DoctorName,
                    AvailableDates = _context.Doctor_Availability
                        .Where(a => a.DoctorId == d.DoctorId)
                        .Select(a => a.AvailableDate.ToDateTime(TimeOnly.MinValue))
                        .ToList(),
                    AvailableTimes = _context.Doctor_Availability
                        .Where(a => a.DoctorId == d.DoctorId)
                        .Select(a => a.AvailableTime.ToTimeSpan())
                        .ToList()
                })
                .ToListAsync();

            return doctors;
        }
    }
}
