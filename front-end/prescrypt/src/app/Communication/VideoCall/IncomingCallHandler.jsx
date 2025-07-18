"use client";
import { useCallback, useEffect } from "react";
import { useVideoCall } from "../VideoCallProvider";
import * as signalR from "@microsoft/signalr";

const useIncomingCallHandler = ({
  users, // We'll now use this to find the caller's chat object
  userId,
  userRole,
  setSelectedUser, // This is crucial for opening the chat
  videoCallConnection,
}) => {
  const {
    callerInfo,
    setCallerInfo,
    setRoomUrl,
    setIncomingCall,
    resetCallState,
    setCallStatus,
    setCallError,
    startCall,
  } = useVideoCall();

  useEffect(() => {
    if (!videoCallConnection) return;

    const handleCallReceived = (data) => {
      console.log("📞 Incoming call received:", data);
      setCallerInfo({
        callerId: data.doctorId,
        callerName: data.doctorName,
        roomUrl: data.roomUrl,
      });
      setRoomUrl(data.roomUrl);
      setIncomingCall(true);
      setCallStatus("incoming");
    };

    videoCallConnection.on("CallReceived", handleCallReceived);

    return () => {
      videoCallConnection.off("CallReceived", handleCallReceived);
    };
  }, [
    videoCallConnection,
    setCallerInfo,
    setRoomUrl,
    setIncomingCall,
    setCallStatus,
  ]);

  const handleAcceptCall = async () => {
    try {
      if (!callerInfo || !videoCallConnection || !callerInfo.roomUrl) {
        console.error("Missing callerInfo or videoCallConnection or roomUrl");
        setCallError("Call information is incomplete.");
        return;
      }

      if (videoCallConnection.state !== signalR.HubConnectionState.Connected) {
        await videoCallConnection.start();
      }

      await videoCallConnection.invoke(
        "AcceptCall",
        callerInfo.callerId,
        userId,
        callerInfo.roomUrl
      );

      console.log("Call accepted, joining room:", callerInfo.roomUrl);

      // --- NEW LOGIC HERE ---
      // Find the user object for the caller from the 'users' list
      const callerChatUser = users.find(
        (user) => user.receiverId === callerInfo.callerId
      );

      if (callerChatUser) {
        // Automatically set the selectedUser to the caller
        setSelectedUser(callerChatUser);
        console.log("Automatically opened chat for:", callerChatUser.fullName);
      } else {
        console.warn(
          "Caller chat user not found in the list. Cannot open chat automatically."
        );
      }
      // --- END NEW LOGIC ---

      startCall(callerInfo.roomUrl, callerInfo.callerName);
      setCallStatus("active");
      setIncomingCall(false); // Hide the incoming call modal after accepting
    } catch (error) {
      console.error("Failed to accept call:", error);
      setCallError("Unable to accept the call: " + error.message);
    }
  };

  const handleRejectCall = async () => {
    try {
      if (!callerInfo || !videoCallConnection) return;

      await videoCallConnection.invoke(
        "RejectCall",
        callerInfo.callerId,
        userId
      );

      console.log("Rejected the call");
      resetCallState();
    } catch (error) {
      console.error("Failed to reject call:", error);
      setCallError("Unable to reject the call.");
    }
  };

  return {
    handleAcceptCall,
    handleRejectCall,
  };
};

export default useIncomingCallHandler;