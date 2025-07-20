"use client";

import { X, Video, Ban, Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ChatHeaderSkeleton = () => {
  return (
    <div className="p-4 border-b border-[#09424D] bg-[#E9FAF2] shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-300" />
          <div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-1" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatHeaderSkeleton;