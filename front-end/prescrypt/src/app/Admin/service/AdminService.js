import axios from 'axios'

const AddDoctorURL = "https://localhost:7021/api/AdminDoctor"

//add new doctor
const AddNewDoctor = async (doctors,schedule) => {
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

export{AddNewDoctor}