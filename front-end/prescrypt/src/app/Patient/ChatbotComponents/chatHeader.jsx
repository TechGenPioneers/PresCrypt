"use client";

export default function ChatHeader({ onClose }) {
return (
    <div className="flex justify-between items-center p-2  bg-white">
        <div className="flex-1 text-center">
            <h3 className="text-lg font-bold text-green-800">Prescrypt Chatbot</h3>
        </div>
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-black transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close chat"
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
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            
        </button>
    </div>
    
);
}