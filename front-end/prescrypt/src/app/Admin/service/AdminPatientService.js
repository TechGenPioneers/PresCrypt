import axios from 'axios'

const AddPatientURL = "https://localhost:7021/api/AdminPatient"

const GetPatients = async () => {
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
const ChangePatientStatus = async (patientId,email,status) => {
  const changePatient = {
    patientId: patientId,
    email:email,
    status: status
  };
  console.log("data",changePatient)
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