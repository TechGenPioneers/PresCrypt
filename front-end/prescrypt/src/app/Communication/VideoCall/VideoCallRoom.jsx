"use client";
import React, { useState, useEffect } from "react";

const VideoCallRoom = ({
  roomUrl,
  onLeave,
  userName,
  otherUserName,
  userRole,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    setIframeKey((prev) => prev + 1); // Force remount iframe when URL changes
    setIsLoading(true);
    setError(null);
  }, [roomUrl]);

  if (!roomUrl) {
    console.log("VideoCallRoom: roomUrl is null, not rendering.");
    return null;
  }

  const getDisplayName = (name, role) => {
  let fullName = "User";

  if (typeof name === "string") {
    fullName = name.trim();
  } else if (typeof name === "object" && name !== null) {
    if (name.fullName && typeof name.fullName === "string" && name.fullName.trim() !== "") {
      fullName = name.fullName.trim();
    } else {
      const first = name.firstName || "";
      const last = name.lastName || "";
      const combined = `${first} ${last}`.trim();
      fullName = combined || "User";
    }
  }

  return role === "Doctor" ? `Dr. ${fullName}` : fullName;
};

   const safeUserName = getDisplayName(userName, userRole);

  // Determine the role of the *other* user
  const otherUserRole = userRole === "Doctor" ? "Patient" : "Doctor";
  const safeOtherUserName = getDisplayName(otherUserName, otherUserRole);
  
  const url = new URL(roomUrl);
  url.searchParams.set("displayName", safeUserName);
  url.searchParams.set("skipPrejoinAutoJoin", "true");
  url.searchParams.set("prejoinConfig.enabled", "false");
  const fullUrl = url.toString();

  console.log("Rendering VideoCallRoom with URL:", fullUrl); // Debug log
console.log("➡️ userRole:", userRole);
console.log("➡️ userName:", userName);
console.log("➡️ otherUserName:", otherUserName);

  return (
    <div className="relative h-[80vh] w-full rounded-lg overflow-hidden border border-gray-200">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4">
          Error: {error}
        </div>
      )}
      <iframe
        key={iframeKey} // Force remount when key changes
        title="Video Call"
        src={fullUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        onLoad={() => {
          console.log("Iframe loaded successfully");
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error("Iframe load error:", e);
          setError("Failed to load video call. Please check your connection.");
        }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />

      <div className="absolute bottom-22 left-0 right-0 flex justify-center gap-4">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-md text-sm text-gray-800">
          <span className="font-semibold">You:</span> {safeUserName}
          <span className="mx-2">|</span>
          <span className="font-semibold">With:</span> {safeOtherUserName}
        </div>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCallRoom;
