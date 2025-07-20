import axios from 'axios'

const AdminDashboardURL = "https://localhost:7021/api/AdminDashboard"

//get all Dashboard data
const GetAllDashboardData = async () => {
       try{
         const response = await  axios.get(`${AdminDashboardURL}/GetAllData?userName=${localStorage.getItem('email')}`)
         return response.data
       }catch(error){
         console.error("Failed to get the data",error);
         throw error
       }
 }

//get all Notifications
const GetAllNotifications = async () => {
  try{
    const response = await  axios.get(`${AdminDashboardURL}/GetAllNotifications`)
    return response.data
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}

//mark as read 
const MarkAsRead = async (notificationId) => {
  try{
    const response = await  axios.post(`${AdminDashboardURL}/${notificationId}`)
    return response
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}

//mark all read
const MarkAllAsRead = async () => {
  try{
    const response = await  axios.put(`${AdminDashboardURL}/MarkAllAsRead`)
    return response
  }catch(error){
    console.error("Failed to get the data",error);
    throw error
  }
}
 export {GetAllDashboardData,GetAllNotifications,MarkAsRead,MarkAllAsRead}