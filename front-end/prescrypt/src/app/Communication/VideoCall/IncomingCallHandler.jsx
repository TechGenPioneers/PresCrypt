import { useCallback, useEffect } from "react";
import { useVideoCall } from "../VideoCallProvider";
import * as signalR from "@microsoft/signalr";
import useSoundManager from "./hooks/useSoundManager";

const useIncomingCallHandler = ({
  users,
  userId,
  userRole,
  doctorName,
  patientName,
  setSelectedUser,
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

  const { playSound, stopSound } = useSoundManager(); // ✅ Fix applied here

  useEffect(() => {
    if (!videoCallConnection) return;

    const handleCallReceived = (data) => {
      console.log("📞 Incoming call received:", data);
      playSound("ringtone", "/sounds/ringtone.mp3", true); // ✅ plays globally

      const callerUser = users.find(
        (user) => user.receiverId === data.doctorId
      );

      if (callerUser) {
        console.log(
          "🔁 Switching chat to:",
          callerUser.fullName || data.doctorName
        );
        setSelectedUser(callerUser);
      } else {
        console.warn("⚠️ Caller not found in user list");
      }

      setCallerInfo({
        callerId: data.doctorId,
        callerName: data.doctorName,
        roomUrl: data.roomUrl,
      });
      setRoomUrl(data.roomUrl);
      setIncomingCall(true);
      setCallStatus("incoming");
    };

    const handleCallRejected = (data) => {
      stopSound("ringtone"); // ✅ stop ringtone when rejected
      console.log("Call was rejected by the other party:", data);
      resetCallState();
      window.dispatchEvent(
        new CustomEvent("callRejected", {
          detail: { rejectedBy: data.rejectedBy },
        })
      );
    };

    videoCallConnection.on("CallReceived", handleCallReceived);
    videoCallConnection.on("CallRejected", handleCallRejected);

    return () => {
      videoCallConnection.off("CallReceived", handleCallReceived);
      videoCallConnection.off("CallRejected", handleCallRejected);
    };
  }, [
    videoCallConnection,
    setCallerInfo,
    setRoomUrl,
    setIncomingCall,
    setCallStatus,
    users,
    setSelectedUser,
    playSound,
    stopSound,
  ]);

  const acceptCall = async (roomUrl, doctorId, patientId) => {
    if (
      !videoCallConnection ||
      videoCallConnection.state !== signalR.HubConnectionState.Connected
    ) {
      throw new Error("Video call connection is not ready");
    }

    await videoCallConnection
      .invoke("AcceptCall", doctorId, patientId, roomUrl)
      .then(() => {
        console.log("✅ Call accepted successfully");
      })
      .catch((error) => {
        console.error("❌ Failed to accept the call:", error);
      });
  };

  const handleAcceptCall = async () => {
    try {
      if (!callerInfo || !callerInfo.roomUrl || !callerInfo.callerName) {
        console.warn("Caller info incomplete", callerInfo);
        return;
      }

      const { roomUrl, callerId: otherUserId } = callerInfo;

      // Determine roles
      const doctorId = userRole === "Doctor" ? userId : otherUserId;
      const patientId = userRole === "Patient" ? userId : otherUserId;

      console.log("Accepting call with:", roomUrl, callerInfo.callerName);

      await acceptCall(roomUrl, doctorId, patientId);
      stopSound("ringtone");

      const currentUser = userRole === "Doctor" ? doctorName : patientName;
      const otherUser = userRole === "Doctor" ? patientName : doctorName;

      startCall(roomUrl, currentUser, otherUser);

      setIncomingCall(false);
      setCallStatus("in-call");
    } catch (error) {
      console.error("❌ Failed to accept the call:", error);
    }
  };

  const handleRejectCall = async () => {
    try {
      if (!callerInfo || !videoCallConnection) return;
      stopSound("ringtone");
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
