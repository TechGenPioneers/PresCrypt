import axios from 'axios'

const DoctorRequestURL = "https://localhost:7021/api/AdminDoctorRequest"

//get all doctor requests
const GetDoctorRequest = async () => {
       try{
         const response = await axios.get(`${DoctorRequestURL}/getAllDoctorRequest`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }
 //get doctor requestby id
const GetRequestById = async (requestId) => {
    try{
      const response = await axios.get(`${DoctorRequestURL}/${requestId}`);
      return response.data;
    }catch(error){
      console.error("Failed to get the data",error);
      throw error
    }
  }
 export{GetDoctorRequest,GetRequestById}