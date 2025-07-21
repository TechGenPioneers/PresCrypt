import axios from "axios";

const AdminContactUsURL = "https://localhost:7021/api/AdminContactUs";

const GetAllContactUsMessages = async () => {
  try {
    const response = await axios.get(`${AdminContactUsURL}/GetAllMessages`);
    console.log("service", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

const GetMsgById = async (inquiryId) => {
  try {
    const response = await axios.get(`${AdminContactUsURL}/${inquiryId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

//mark as read
const MarkAsRead = async (inquiryId) => {
  try {
    const response = await axios.patch(`${AdminContactUsURL}/${inquiryId}`);
    return response;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

const SendReply = async (inquiryId, message) => {
  const data = {
    inquiryId: inquiryId,
    replyMessage: message,
  };
  try {
    const response = await axios.post(`${AdminContactUsURL}/SendReply`, data);
    return response;
  } catch (error) {
    console.error("Failed to get the data", error);
    throw error;
  }
};

export { GetAllContactUsMessages, GetMsgById, MarkAsRead, SendReply };
