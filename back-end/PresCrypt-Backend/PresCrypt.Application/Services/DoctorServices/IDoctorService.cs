namespace PresCrypt_Backend.PresCrypt.Application.Services.DoctorServices
{
    public interface IDoctorService
    {
        Task<List<DoctorSearchDto>> GetDoctorAsync(string specialization, string hospitalName);
    }
}
