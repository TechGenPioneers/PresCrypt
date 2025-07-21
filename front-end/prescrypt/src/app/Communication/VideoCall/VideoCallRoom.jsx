"use client";
import React, { useState, useEffect } from "react";

const VideoCallRoom = ({
  roomUrl,
  onLeave,
  userName, // This is now the current user's name object
  otherUserName,
  userRole,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
    setError(null);
  }, [roomUrl]);

  if (!roomUrl) return null;

  const getDisplayName = (name) => {
    if (typeof name === "object") {
      return name.fullName || name.firstName || "User";
    }
    return name || "User";
  };

  const displayName =
    userRole === "Doctor"
      ? `Dr. ${getDisplayName(userName)}`
      : getDisplayName(userName);

  const otherDisplayName =
    userRole === "Doctor"
      ? getDisplayName(otherUserName)
      : `Dr. ${getDisplayName(otherUserName)}`;

  // Debug formatted names
  useEffect(() => {
    console.log("Formatted names:", {
      displayName,
      otherDisplayName,
    });
  }, [displayName, otherDisplayName]);

  const url = new URL(roomUrl);
  url.searchParams.set("displayName", displayName);
  url.searchParams.set("skipPrejoinAutoJoin", "true");
  url.searchParams.set("prejoinConfig.enabled", "false");

  return (
    <div className="relative h-[80vh] w-full rounded-lg overflow-hidden border border-gray-200">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4">
          Error: {error}
        </div>
      )}

      <iframe
        key={iframeKey}
        title="Video Call"
        src={url.toString()}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
        onError={() => setError("Failed to load video call")}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />

      <div className="absolute bottom-22 left-0 right-0 flex justify-center gap-4">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-md text-sm text-gray-800">
          <span className="font-semibold">You:</span>{" "}
          {displayName || "Unknown User"}
          <span className="mx-2">|</span>
          <span className="font-semibold">With:</span>{" "}
          {otherDisplayName || "Unknown User"}
        </div>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Leave Call
        </button>
      </div>
    </div>
  );
};

export default VideoCallRoom;
