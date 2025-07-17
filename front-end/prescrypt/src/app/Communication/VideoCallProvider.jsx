"use client";
import { createContext, useContext, useState, useCallback } from "react";

const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [roomUrl, setRoomUrl] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [activeCall, setActiveCall] = useState(null); // This is crucial
  const [callError, setCallError] = useState(null);

  const receiveCall = useCallback(({ doctorId, doctorName, roomUrl }) => {
    setIncomingCall(true);
    setCallerInfo({ callerId: doctorId, callerName: doctorName });
    setRoomUrl(roomUrl);
    setCallStatus("incoming");
  }, []);

  const startCall = useCallback((roomUrl, otherUserName) => {
    // Ensure this sets the activeCall state correctly
    setActiveCall({ roomUrl, otherUserName });
    setCallStatus("active");
    setIncomingCall(false); // Hide the incoming call modal
    setCallerInfo(null); // Clear caller info once call is active
    setRoomUrl(null); // Clear room URL once call is active
  }, []);

  const endCall = useCallback(() => {
    setActiveCall(null);
    setCallStatus("ended");
  }, []);

  const resetCallState = useCallback(() => {
    setIncomingCall(false);
    setCallerInfo(null);
    setRoomUrl(null);
    setCallStatus(null);
    setActiveCall(null);
    setCallError(null);
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        activeCall,
        setActiveCall,
        incomingCall,
        callerInfo,
        roomUrl,
        callStatus,
        callError,
        setCallerInfo,
        setRoomUrl,
        setIncomingCall,
        setCallStatus,
        setCallError,
        receiveCall,
        startCall,
        endCall,
        resetCallState,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  }
  return context;
};