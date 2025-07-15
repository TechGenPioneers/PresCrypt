"use client";
import React from "react";

const VideoCallRoom = ({
  roomUrl,
  onLeave,
  userName,
  otherUserName,
  userRole,
}) => {
  if (!roomUrl) return null;

  const fullUrl = `${roomUrl}?displayName=${encodeURIComponent(
    userName
  )}&skipPrejoinAutoJoin=true&prejoinConfig.enabled=false`;

  return (
    <div className="relative h-[80vh] w-full rounded-lg overflow-hidden border border-gray-200">
      <iframe
        title="Video Call"
        src={fullUrl}
        allow="camera; microphone; fullscreen; display-capture"
        className="w-full h-full"
        frameBorder="0"
      />

      <div className="absolute bottom-22 left-0 right-0 flex justify-center gap-4">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-md text-sm text-gray-800">
          <span className="font-semibold">You:</span> {userName}
          <span className="mx-2">|</span>
          <span className="font-semibold">With:</span> {otherUserName}
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
