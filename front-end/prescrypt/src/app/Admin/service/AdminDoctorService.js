import axios from 'axios'
import useAuthGuard from "@/utils/useAuthGuard";

const AddDoctorURL = "https://localhost:7021/api/AdminDoctor"

//add new doctor
const AddNewDoctor = async (doctors,schedule) => {
  useAuthGuard("Admin"); // Ensure the user is authenticated as an Admin
    const requestData = {
        doctor: doctors,       
        availability: schedule
      };
    console.log("Save Doctor.......................................",requestData)
    try{
        const response = await axios.post(
            AddDoctorURL,
            requestData
        );
        console.log(response.data)
        return response.data;
    }
    catch(error){
        console.error("Failed to get the data",error);
        throw error;
    }
}

//update doctor
const UpdateDoctor = async (doctors,schedule) => {
  const requestData = {
      doctor: doctors,       
      availability: schedule
    };
  console.log("Save Doctor.......................................",requestData)
  try{
      const response = await axios.patch(
          AddDoctorURL,
          requestData
      );
      console.log(response.data)
      return response.data;
  }
  catch(error){
      console.error("Failed to get the data",error);
      throw error;
  }
}

//delete doctor
const DeleteDoctor = async (doctorId) => {
  try{
    const response = await axios.delete(`${AddDoctorURL}/${doctorId}`);
    return response.data;
  }catch(error){
    console.error("Failed to delete the doctor",error);
    throw error;
  }
}

//get all doctors
const GetDoctors = async () => {
    //get the doctors
       try{
         const response = await  axios.get(`${AddDoctorURL}/getAllDoctors`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }
//get doctor by id
const GetDoctorById = async (doctorId) => {
  try{
    const response = await axios.get(`${AddDoctorURL}/${doctorId}`);
    return response.data;
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}

//get all hospitals
 const GetHospitals = async () => {
    //get the doctors
       try{
         const response = await  axios.get(`${AddDoctorURL}/getAllHospitals`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }
export{AddNewDoctor,GetDoctors,GetHospitals,GetDoctorById,UpdateDoctor,DeleteDoctor}