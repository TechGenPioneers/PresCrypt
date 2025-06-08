import axios from 'axios';
const baseUrl = "https://localhost:7021/api/Chat"

const GetUsers = async()=>{
    try {
        const userId = "P002"
        const response = await axios.get(`${baseUrl}/GetChatUsers?senderId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users", error);
        throw error;
    }
}
const GetAllMessages = async(receiverId)=>{
    try {
        const senderId = "P002"
        const response = await axios.get(`${baseUrl}/GetAllMessages?senderId=${senderId}&receiverId=${receiverId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users", error);
        throw error;
    }
}

const SendMessage = async (message) => {
    try {
        console.log("message",message)
        const response = await axios.post(`${baseUrl}/SendMessage`, message);
        return response.data;
    } catch (error) {
        console.error("Failed to send message", error);
        throw error;
    }
}
export {GetUsers,GetAllMessages,SendMessage}