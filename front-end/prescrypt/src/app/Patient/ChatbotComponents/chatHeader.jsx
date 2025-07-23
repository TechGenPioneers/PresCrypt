"use client";

import PatientDashboard from "../PatientComponents/patientDashboard";

export default function ChatHeader({ onClose }) {
return (
    <div className="flex items-center justify-between p-1.5 bg-gradient-to-r from-teal-800 to-teal-500 shadow rounded-t-md">
        {/* Logo or Avatar */}
        <div className="flex items-center space-x-2">
            <div className="bg-white rounded-full ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4.5 w-4.5 text-teal-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h8M12 8v8"
                    />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-white">  PresCrypt Assistant</h3>
        </div>

        {/* Status and Close Button */}
        <div className="flex items-center space-x-3">
            {/* Status indicator */}
            <span className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                <span className="text-xs text-white">Online</span>
            </span>
            {/* Close button */}
            <button
                onClick={onClose}
                className="text-white hover:text-red-400 transition p-1 rounded-full hover:bg-white hover:bg-opacity-20 group"
                aria-label="Close chat"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:rotate-90 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        </div>
    </div>
);
}
