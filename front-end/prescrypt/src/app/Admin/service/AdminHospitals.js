import axios from 'axios'

const AddHospitalURL = "https://localhost:7021/api/AdminHospital"

//add new Hospital
const AddNewHospital = async (newHospital) => {
    try{
        const response = await axios.post(
            AddHospitalURL,
            newHospital
        );
        console.log(response.data)
        return response;
    }
    catch(error){
        console.error("Failed to get the data",error);
        throw error;
    }
}

//get all Hospitals
const GetAllHospitals = async () => {
    //get the Hospitals
       try{
         const response = await  axios.get(`${AddHospitalURL}`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }
//get Hospital by id
const GetHospitalById = async (hospitalId) => {
  try{
    const response = await axios.get(`${AddHospitalURL}/${hospitalId}`);
    return response.data;
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}

const UpdateHospital = async (hospital) => {
  try{
      const response = await axios.put(
          AddHospitalURL,
          hospital
      );
      console.log(response.data)
      return response;
  }
  catch(error){
      console.error("Failed to get the data",error);
      throw error;
  }
}

//delete Hospital
const DeleteHospital = async (hospitalId) => {
  try{
    const response = await axios.delete(`${AddHospitalURL}/${hospitalId}`);
    return response;
  }catch(error){
    console.error("Failed to delete the Hospital",error);
    throw error;
  }
}

export {GetAllHospitals,GetHospitalById,UpdateHospital,DeleteHospital,AddNewHospital}