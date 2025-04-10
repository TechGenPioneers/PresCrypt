import axios from 'axios'

const DoctorRequestURL = "https://localhost:7021/api/AdminDoctorRequest"
const ReasonMail = "https://localhost:7021/api/Email"

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
  //send e mail requests
  const SendMail = async (mail) => {
    console.log("Mail object being sent:", mail);
  
    if (!mail.Receptor  || !mail.reason) {
      console.error("Missing email or reason in the mail object.");
      throw new Error("Email or reason is missing.");
    }
  
    try {
      const response =await axios.post(
        ReasonMail,
        mail
    );
      console.log("Response from mail server:", response.data);
      return response.data;
    } catch (error) {
      // Improved error logging with status code and message
      console.error("Failed to send mail:", error.response || error.message);
      throw error; // Rethrow error for handling upstream (in handleSubmit)
    }
  };
  
 export{GetDoctorRequest,GetRequestById,SendMail}