"use client";

import { useEffect, useState } from "react";
import ChatList from "./component/ChatList";
import ChatWindow from "./component/ChatWindow";
import NoChatSelected from "./component/NoChatSelected";
import {
  EstablishSignalRConnection,
  GetUsers,
  GetUserNames,
} from "./service/ChatService";
import useVideoCallSignalR from "./VideoCall/hooks/useVideoCallSignalR";
import useIncomingCallHandler from "./VideoCall/IncomingCallHandler";
import { VideoCallProvider, useVideoCall } from "./VideoCallProvider";
import IncomingCallModal from "./VideoCall/IncomingCallModal";

const Layout = ({ userId, userRole }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatConnection, setChatConnection] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [connection, setConnection] = useState(); // This seems to be the chat connection

  const [userNames, setUserNames] = useState({
    DoctorName: "",
    PatientName: "",
  });

  const {
    incomingCall,
    callerInfo,
    roomUrl, // This will be the incoming room URL, used by the modal
    callStatus,
    callError,
    receiveCall, // This is called by useVideoCallSignalR when a call is received
    setCallStatus,
    setCallError,
  } = useVideoCall();

  const {
    connection: videoCallConnection,
    status: videoCallHubStatus,
  } = useVideoCallSignalR(userId, userRole);

  const { handleAcceptCall, handleRejectCall } = useIncomingCallHandler({
    users, // Pass users if needed by the hook for other logic
    userId,
    userRole,
    setSelectedUser, // Pass setSelectedUser to allow the hook to set it on accept
    videoCallConnection,
  });

  const fetchUsers = async () => {
    try {
      const response = await GetUsers(userId);
      setUsers(response || []);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    const newConnection = EstablishSignalRConnection();
    setConnection(newConnection); // Set chatConnection
  }, []);

  const fetchUserNames = async () => {
    try {
      const doctorId = userRole === "Doctor" ? userId : selectedUser?.receiverId;
      const patientId = userRole === "Patient" ? userId : selectedUser?.receiverId;

      if (!doctorId || !patientId) return;

      const names = await GetUserNames(doctorId, patientId);
      setUserNames({
        DoctorName: names?.doctorName || "Doctor",
        PatientName: names?.patientName || "Patient",
      });
    } catch (err) {
      console.error("Failed to fetch user names", err);
    }
  };

  useEffect(() => {
    console.log("Video call connection status:", videoCallHubStatus);
  }, [videoCallHubStatus]);

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  useEffect(() => {
    if (selectedUser) {
      fetchUserNames();
    }
  }, [selectedUser]);

  return (
    <div className="flex h-screen p-2 gap-2">
      <div className="w-1/4 bg-white border rounded-xl overflow-y-auto">
        <ChatList
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          userId={userId}
          fetchUsers={fetchUsers}
          setUsers={setUsers}
          users={users}
          isUsersLoading={isUsersLoading}
          connection={chatConnection} // Ensure this is `chatConnection`
        />
      </div>

      <div className="w-3/4 flex flex-col bg-[#ecf0f1] rounded-xl overflow-hidden">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            userId={userId}
            userRole={userRole}
            connection={chatConnection} // Ensure this is `chatConnection`
            videoCallConnection={videoCallConnection}
            fetchUsers={fetchUsers}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            doctorName={userNames.DoctorName}
            patientName={userNames.PatientName}
          />
        ) : (
          <NoChatSelected />
        )}
      </div>

      {/* This is the correct place for the IncomingCallModal */}
      {incomingCall && callerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <IncomingCallModal
            callerName={callerInfo.callerName}
            onAccept={handleAcceptCall} // This calls the hook's accept logic
            onReject={handleRejectCall} // This calls the hook's reject logic
          />
        </div>
      )}

      {callError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-red-600 text-white p-3 rounded-md z-50">
          {callError}
        </div>
      )}
    </div>
  );
};

export default Layout;