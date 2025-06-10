"use client";
import React, { useState, useEffect } from "react";
import VideoCallButton from "../VideoCall/VideoCallButton";
import IncomingCallModal from "../VideoCall/IncomingCallModal";
import VideoCallRoom from "../VideoCall/VideoCallRoom";
import axiosInstance from "../../Doctor/utils/axiosInstance";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
// import useAuthGuard from "@/utils/useAuthGuard";

const ChatInterface = () => {
  // Get from auth context (recommended)
  // const { role: userRole, userId: currentUserId } = useAuthGuard();
  const userRole = "doctor"; // Keep temporary fallback
  
  // Get from auth context
  // const { userId: currentUserId } = useAuthGuard();
  const currentUserId = "D002"; // Keep temporary fallback
  
  // Get from props or route params
  // const { participantId: otherParticipantId } = props;
  const otherParticipantId = "P002"; // Keep temporary fallback

  const [roomUrl, setRoomUrl] = useState("");
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerName, setCallerName] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [otherParticipantName, setOtherParticipantName] = useState("");
  const [connection, setConnection] = useState(null);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:7021/videocallhub") // Consider moving to env variable
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  // Setup SignalR event handlers when connection changes
  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          console.log("SignalR Connected");

          // Register for incoming calls
          connection.on("IncomingCall", (data) => {
            if (userRole === "patient") { // Only patients receive incoming calls
              setCallerName(data.doctorId);
              setRoomUrl(data.roomUrl);
              setIncomingCall(true);
            }
          });

          // Register for call accepted notifications
          connection.on("CallAccepted", (data) => {
            if (userRole === "doctor") {
              toast.success(`Patient ${data.patientId} has joined the call!`);
            }
          });

          // Register for call rejected notifications
          connection.on("CallRejected", (data) => {
            if (userRole === "doctor") {
              toast.warning(`Patient ${data.patientId} has rejected the call.`);
            }
          });
        })
        .catch(err => console.error("SignalR Connection Error: ", err));
    }
  }, [connection, userRole]);

  // Effect to fetch user names
  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        let doctorIdToFetch = "";
        let patientIdToFetch = "";

        if (userRole === "doctor") {
          doctorIdToFetch = currentUserId;
          patientIdToFetch = otherParticipantId;
        } else {
          doctorIdToFetch = otherParticipantId;
          patientIdToFetch = currentUserId;
        }

        const response = await axiosInstance.get(
          `/DoctorPatientVideoCall/user-names?doctorId=${doctorIdToFetch}&patientId=${patientIdToFetch}`
        );
        const data = response.data;

        if (userRole === "doctor") {
          setCurrentUserName(`Dr. ${data.doctorName}`);
          setOtherParticipantName(data.patientName);
        } else {
          setCurrentUserName(data.patientName);
          setOtherParticipantName(data.doctorName);
        }
      } catch (error) {
        console.error("Failed to fetch user names:", error);
        setCurrentUserName(userRole === "doctor" ? "Doctor" : "Patient");
        setOtherParticipantName("Other Participant");
      }
    };

    if (currentUserId && otherParticipantId) {
      fetchUserNames();
    }
  }, [currentUserId, otherParticipantId, userRole]);

  const startCall = async () => {
    try {
      const response = await axiosInstance.post(
        `/DoctorPatientVideoCall/create-room?patientId=${otherParticipantId}`,
        { roomName: `${currentUserId}-room` }
      );

      const data = response.data;
      let roomUrlFromBackend = data.roomUrl;

      if (currentUserName) {
        const url = new URL(roomUrlFromBackend);
        url.searchParams.set("displayName", currentUserName);
        roomUrlFromBackend = url.toString();
      }

      setRoomUrl(roomUrlFromBackend);
      setCurrentRoomId(roomUrlFromBackend.split("/").pop());

      toast.success(`Video call started! ${otherParticipantName} is being notified.`);
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to start video call. Please try again.");
    }
  };

  const acceptCall = async () => {
    setIncomingCall(false);
    
    if (connection) {
      try {
        await connection.invoke("NotifyDoctorCallAccepted", otherParticipantId, currentUserId);
        toast.success("Call accepted! Connecting...");
      } catch (err) {
        console.error("Error notifying doctor:", err);
        toast.error("Failed to notify doctor about call acceptance.");
      }
    }
  };

  const rejectCall = () => {
    setIncomingCall(false);
    if (connection) {
      try {
        connection.invoke("NotifyDoctorCallRejected", otherParticipantId, currentUserId);
        toast.info("Call rejected.");
      } catch (err) {
        console.error("Error notifying doctor about rejection:", err);
        toast.error("Failed to notify doctor about call rejection.");
      }
    }
  };

  const endCall = () => {
    setRoomUrl("");
    setCurrentRoomId("");
    toast.info("Call ended.");
  };

  return (
    <div className="mt-1 ml-1">
      <ToastContainer position="top-right" autoClose={5000} />
      {!roomUrl && userRole === "doctor" && (
        <VideoCallButton onClick={startCall} />
      )}

      {incomingCall && (
        <IncomingCallModal
          callerName={callerName}
          onAccept={acceptCall}
          onReject={rejectCall}
        />
      )}

      {roomUrl && (
        <VideoCallRoom
          roomUrl={roomUrl}
          onLeave={endCall}
          currentUserName={currentUserName}
          otherParticipantName={otherParticipantName}
        />
      )}
    </div>
  );
};

export default ChatInterface;