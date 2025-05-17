"use client";
import React from 'react';
export default function SubmitButton({
  
  onClick,
  text,
  loading = false,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-3 px-4 rounded-lg font-bold
        bg-teal-600 hover:bg-teal-700 text-white
        transition-colors duration-200
        flex items-center justify-center
        ${loading ? "opacity-80" : ""}
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {text}
         
        </>
      ) : (
        text
      )}
    </button>
  );
}