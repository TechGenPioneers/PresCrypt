import axios from "axios";
import * as signalR from "@microsoft/signalr";
const baseUrl = "http://localhost:7021/api/ChatMsg";
const baseUrlVideo = "http://localhost:7021/api/DoctorPatientVideoCall";

const GetUsers = async (userId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/GetChatUsers?senderId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};
const GetAllMessages = async (senderId, receiverId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/GetAllMessages?senderId=${senderId}&receiverId=${receiverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

const SendMessage = async (message) => {
  try {
    console.log("message", message);
    const response = await axios.post(`${baseUrl}/SendMessage`, message);
    return response.data;
  } catch (error) {
    console.error("Failed to send message", error);
    throw error;
  }
};

const MarkMessagesAsRead = async (senderId, receiverId) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/MarkMessagesAsRead?senderId=${senderId}&receiverId=${receiverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send message", error);
    throw error;
  }
};

const DeleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${baseUrl}?messageId=${messageId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to send message", error);
    throw error;
  }
};

const EstablishSignalRConnection = () => {
  const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:7021/chatHub`, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  newConnection
    .start()
    .then(() => {
      console.log("✅ .js file - Connected to SignalR hub");
    })
    .catch((err) => {
      console.error("❌ .js file - SignalR connection failed: ", err);
    });

  return newConnection;
};
const StartVideoCall = async (doctorId, patientId) => {
  try {
    const response = await axios.post(
      `${baseUrlVideo}/start-call?doctorId=${doctorId}&patientId=${patientId}`
    );
    return response.data; // This data should contain { roomUrl }
  } catch (error) {
    console.error("Failed to start video call", error);
    throw error;
  }
};
const GetUserNames = async (doctorId, patientId) => {
  try {
    const response = await axios.get(
      `${baseUrlVideo}/user-names?doctorId=${doctorId}&patientId=${patientId}`
    );
    return response.data; // { DoctorName, PatientName }
  } catch (error) {
    console.error("Failed to fetch user names", error);
    throw error;
  }
};

const GetVideoCallRoom = async (patientId) => {
  try {
    const response = await axios.get(
      `${baseUrlVideo}/create-room?patientId=${patientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to get video call room", error);
    throw error;
  }
};

const EstablishVideoSignalRConnection = (userId) => {
  const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(`http://localhost:7021/videoCallHub?userId=${userId}`)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return newConnection;
};

export {
  GetUsers,
  GetAllMessages,
  SendMessage,
  MarkMessagesAsRead,
  DeleteMessage,
  EstablishSignalRConnection,
  StartVideoCall,
  GetUserNames,
  GetVideoCallRoom,
  EstablishVideoSignalRConnection,
};
