"use client";
import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          💬
        </button>
      </div>

      {/* Sliding Chat Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[400px] bg-white z-40 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Prescrypt Chatbot</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">
          <p>Hello Kayle! Welcome to Prescrypt.</p>
          <div className="bg-teal-600 text-white p-2 rounded mt-2 w-fit">
            How can I view my past appointments?
          </div>
        </div>
        <div className="p-4 border-t">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </>
  );
}
