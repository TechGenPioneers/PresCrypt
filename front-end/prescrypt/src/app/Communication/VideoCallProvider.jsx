"use client";

import { createContext, useContext, useState, useCallback } from "react";

const VideoCallContext = createContext();

export const VideoCallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerInfo, setCallerInfo] = useState(null);
  const [roomUrl, setRoomUrl] = useState(null);

  const receiveCall = useCallback(({ callerId, callerName, roomUrl }) => {
    setIncomingCall(true);
    setCallerInfo({ callerId, callerName });
    setRoomUrl(roomUrl);
  }, []);

  const resetCallState = useCallback(() => {
    setIncomingCall(false);
    setCallerInfo(null);
    setRoomUrl(null);
  }, []);

  return (
    <VideoCallContext.Provider
      value={{
        incomingCall,
        callerInfo,
        roomUrl,
        receiveCall,
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
