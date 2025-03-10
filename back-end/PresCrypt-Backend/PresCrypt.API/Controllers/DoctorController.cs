using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PresCrypt_Backend.PresCrypt.API.Dto;
using PresCrypt_Backend.PresCrypt.Application.Services.DoctorServices;
using PresCrypt_Backend.PresCrypt.Core.Models;
using static Azure.Core.HttpHeader;

namespace PresCrypt_Backend.PresCrypt.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
         private readonly ApplicationDbContext _context;
        private readonly IDoctorService _doctorServices;
        public DoctorController(ApplicationDbContext context, IDoctorService doctorServices)
        {
            _context = context;
            _doctorServices = doctorServices;
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<DoctorSearchDto>>> GetDoctors([FromQuery] string specialization, [FromQuery] string hospitalName)//ORM Mapping
        {
            var doctors = await _doctorServices.GetDoctorAsync(specialization, hospitalName);
            return Ok(doctors);
            //var doctors = await _context.Doctors  //<--Here I used LINQ instead of ORM-->
            //    .Join(
            //        _context.Hospitals, 
            //        doctor => doctor.DoctorId, 
            //        hospital => hospital.DoctorId, 
            //        (doctor, hospital) => new { doctor, hospital }
            //    )
            //    .Where(dh =>
            //        (string.IsNullOrEmpty(specialization) || dh.doctor.Specialization.Contains(specialization)) && // Filter by specialization
            //        (string.IsNullOrEmpty(hospitalName) || dh.hospital.HospitalName.Contains(hospitalName)) // Filter by hospital name
            //    )
            //    .GroupJoin(
            //        _context.Doctor_Availability,
            //        doctor => doctor.doctor.DoctorId,
            //        doctorAvailability => doctorAvailability.DoctorId,
            //        (doctor, availability) => new DoctorSearchDto
            //        {
            //            DoctorName = doctor.doctor.DoctorName,
            //            AvailableDates = availability.Select(a => a.AvailableDate.ToDateTime(TimeOnly.MinValue)).ToList(), // Convert DateOnly to DateTime
            //            AvailableTimes = availability.Select(a => a.AvailableTime.ToTimeSpan()).ToList() // Convert time format
            //        }
            //    )
            //    .ToListAsync(); // Execute the query

            //return Ok(doctors);
        }


        //[HttpGet("search")] // <--------here there is an issue with mapster automatic mapping------->
        //public async Task<ActionResult<List<DoctorSearchDto>>> GetDoctors()
        //{
        //    var doctors = await _context.Doctors
        //        .GroupJoin(
        //            _context.Doctor_Availability,
        //            doctor => doctor.DoctorId,
        //            doctorAvailability => doctorAvailability.DoctorId,
        //            (doctor, availability) => new
        //            {
        //                Doctor = doctor,
        //                AvailableDates = availability.Select(a => a.AvailableDate).ToList(), // Corrected: Use AvailableDate
        //                AvailableTimes = availability.Select(a => a.AvailableTime.ToTimeSpan()).ToList() // Corrected: Use ToTimeSpan()
        //            })
        //        .ToListAsync();

        //    // Now, map the data from the anonymous object to DoctorDto using Mapster
        //    var response = doctors.Adapt<List<DoctorSearchDto>>();

        //    return Ok(response);
        //}




        [HttpGet("book/{doctorId}")]//for this I used mapster
        public async Task<ActionResult<List<DoctorBookingDto>>> GetDoctorBookedbyId(string doctorId)
        {
            var doctor = (await _context.Doctors.FindAsync(doctorId));
            if (doctor is null)
            {
                return NotFound();
            }
            var response = doctor.Adapt<DoctorBookingDto>();

            return Ok(response);

        }


    }
}
