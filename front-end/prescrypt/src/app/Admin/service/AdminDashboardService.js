import axios from 'axios'

const AdminDashboardURL = "https://localhost:7021/api/AdminDashboard"

//get all Dashboard data
const GetAllDashboardData = async () => {
       try{
         const response = await  axios.get(`${AdminDashboardURL}/GetAllData`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }
 export {GetAllDashboardData}