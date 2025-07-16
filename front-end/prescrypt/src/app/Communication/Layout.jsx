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
import * as signalR from "@microsoft/signalr";
import useVideoCallSignalR from "./VideoCall/hooks/useVideoCallSignalR";
import useIncomingCallHandler from "./VideoCall/IncomingCallHandler";
import { useVideoCall } from "./VideoCallProvider";
import IncomingCallModal from "./VideoCall/IncomingCallModal";

const Layout = ({ userId, userRole }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatConnection, setChatConnection] = useState(null);
  const [newMessage, setNewMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [connection, setConnection] = useState();
  const { incomingCall, callerInfo, roomUrl, resetCallState } = useVideoCall();
  const [userNames, setUserNames] = useState({
    DoctorName: "",
    PatientName: "",
  });

  const videoCallConnection = useVideoCallSignalR(userId, userRole);

  const { handleAcceptCall, handleRejectCall } = useIncomingCallHandler({
    users,
    userId,
    userRole,
    setSelectedUser,
    roomUrl,
    resetCallState,
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
  // SignalR setup
  useEffect(() => {
    const newConnection = EstablishSignalRConnection();
    setConnection(newConnection);
  }, []);

  // Update this in Layout.jsx
  const fetchUserNames = async () => {
    try {
      // Corrected ID assignment - always use userId as the current user
      const doctorId =
        userRole === "Doctor" ? userId : selectedUser?.receiverId;
      const patientId =
        userRole === "Patient" ? userId : selectedUser?.receiverId;

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
    fetchUsers(); // Initial fetch when component mounts
  }, [userId]); // Re-fetch when userId changes

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
          connection={chatConnection}
        />
      </div>

      <div className="w-3/4 flex flex-col bg-[#ecf0f1] rounded-xl overflow-hidden">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            userId={userId}
            userRole={userRole}
            connection={chatConnection}
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

      {incomingCall && callerInfo && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <IncomingCallModal
            callerName={callerInfo.callerName || "Unknown Caller"}
            onAccept={() => handleAcceptCall(callerInfo)}
            onReject={handleRejectCall}
          />
        </div>
      )}
    </div>
  );
};

export default Layout;
