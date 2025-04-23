import axios from 'axios'

const ReportUrl = "https://localhost:7021/api/AdminReport"

const GetAllDetails = async () => {
    //get the Details
       try{
         const response = await  axios.get(`${ReportUrl}/GetAll`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }

 export{GetAllDetails}