import axios from 'axios'

const AddDoctorURL = "https://localhost:7021/api/AdminDoctor"

//add new doctor
const AddNewDoctor = async (doctor) => {
    console.log("Save Doctor.......................................",doctor)
    try{
        const response = await axios.post(
            AddDoctorURL,
            doctor
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