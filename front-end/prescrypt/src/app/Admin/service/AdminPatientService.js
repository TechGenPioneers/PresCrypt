import axios from 'axios'
import useAuthGuard from "@/utils/useAuthGuard";

const AddPatientURL = "https://localhost:7021/api/AdminPatient"

const GetPatients = async () => {
  useAuthGuard("Admin"); // Ensure the user is authenticated as an Admin
    //get the Patients
       try{
         const response = await  axios.get(`${AddPatientURL}/GetAllPatients`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }

 //get patient by id
const GetPatientById = async (patientId) => {
    try{
      const response = await axios.get(`${AddPatientURL}/${patientId}`);
      console.log("response:", response.data);
      return response.data;
    }catch(error){
      console.error("Failed to get the data",error);
      throw error
    }
  }

   //change patient status
const ChangePatientStatus = async (patientId,status) => {
  const changePatient = {
    patientId: patientId,
    status: status
  };
  try{
    const response = await axios.patch(
      AddPatientURL,
      changePatient
    );
    console.log("response:", response.data);
    return response.data;
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}

 export {GetPatients, GetPatientById,ChangePatientStatus}