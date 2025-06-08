import axios from 'axios';
const baseUrl = "https://localhost:7021/api/Chat"

const GetUsers = async(userId)=>{
    try {
        const response = await axios.get(`${baseUrl}/GetChatUsers?senderId=${userId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch users", error);
        throw error;
    }
}
const GetAllMessages = async(senderId,receiverId)=>{
    try {
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

const MarkMessagesAsRead = async (senderId,receiverId) => {
    try {
        const response = await axios.patch(`${baseUrl}/MarkMessagesAsRead?senderId=${senderId}&receiverId=${receiverId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to send message", error);
        throw error;
    }
}

const DeleteMessage = async (messageId) => {
    try {
        const response = await axios.delete(`${baseUrl}?messageId=${messageId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to send message", error);
        throw error;
    }
}
export {GetUsers,GetAllMessages,SendMessage,MarkMessagesAsRead,DeleteMessage}