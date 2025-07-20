"use client";

import React, { useEffect, useRef, useState } from "react";

const IncomingCallModal = ({
  callerName,
  callerTitle = "Dr.",
  onAccept,
  onReject,
}) => {
  const audioRef = useRef(null);
  const [isRinging, setIsRinging] = useState(true);
  const [callTime, setCallTime] = useState(0);
  const [rejectionNotification, setRejectionNotification] = useState(null);

  // Handle ringtone
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch((e) => console.warn("Autoplay failed:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  // Call timer (starts when accepted)
  useEffect(() => {
    let timer;
    if (!isRinging && callTime >= 0) {
      timer = setInterval(() => {
        setCallTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRinging, callTime]);

  const handleAccept = () => {
    setIsRinging(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onAccept();
  };

  const handleReject = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onReject();
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  // In IncomingCallModal component
  useEffect(() => {
    const handleCallRejected = (event) => {
      console.log("Call rejected globally", event.detail);
      setIsRinging(false);
      setRejectionNotification({
        message: `Call rejected by ${
          event.detail.rejectedBy === userId ? "you" : "the other party"
        }`,
        visible: true,
      });

      // Auto-dismiss after 3 seconds
      const timeout = setTimeout(() => {
        setRejectionNotification(null);
        onReject();
      }, 3000);

      return () => clearTimeout(timeout);
    };
    // Immediately close the modal by calling onReject
    window.addEventListener("callRejected", handleCallRejected);
    return () => {
      window.removeEventListener("callRejected", handleCallRejected);
    };
  }, [onReject]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm">
      {/* Ringing tone */}
      <audio ref={audioRef} src="/sounds/ringtone.mp3" />
      {rejectionNotification?.visible && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
          {rejectionNotification.message}
        </div>
      )}

      <div
        className={`bg-gradient-to-br from-blue-50 to-white p-8 rounded-3xl shadow-2xl text-center w-full max-w-md transition-all duration-300 ${
          isRinging ? "animate-pulse" : ""
        }`}
      >
        {/* Caller avatar */}
        <div className="relative mx-auto mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-4 border-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          {isRinging && (
            <div className="absolute -top-2 -right-2">
              <span className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500"></span>
              </span>
            </div>
          )}
        </div>

        {/* Caller info */}
        <h3 className="text-3xl font-bold text-gray-800 mb-1">
          {callerTitle}{" "}
          {callerName?.fullName || callerName?.firstName || "Unknown Caller"}
        </h3>
        <p className="text-gray-500 mb-6">
          {isRinging ? (
            <span className="flex items-center justify-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Incoming call
            </span>
          ) : (
            <span className="text-blue-600 font-medium">
              {formatTime(callTime)}
            </span>
          )}
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={handleAccept}
            className={`${
              isRinging
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
          >
            {isRinging ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Accept
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                End Call
              </>
            )}
          </button>

          {isRinging && (
            <button
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Decline
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
