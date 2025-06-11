"use client";
import React from "react";

const VideoCallRoom = ({ roomUrl, onLeave, userName, otherUserName }) => {
  if (!roomUrl) return null;

  return (
    <div className="relative h-[80vh] w-full rounded-lg overflow-hidden border border-gray-200">
      <iframe
        title="Video Call"
        src={roomUrl}
        allow="camera; microphone; fullscreen; speaker; display-capture"
        className="w-full h-full"
      />
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <div className="bg-white bg-opacity-80 px-4 py-2 rounded-lg shadow-md">
          <span className="font-medium">You: {userName}</span>
          <span className="mx-2">|</span>
          <span className="font-medium">Calling: {otherUserName}</span>
        </div>
        
        <button
          onClick={onLeave}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
          </svg>
          End Call
        </button>
      </div>
    </div>
  );
};

export default VideoCallRoom;