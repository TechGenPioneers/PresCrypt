import React from 'react';
import Image from "next/image";

export default function RegistrationLayout({ 
  children, 
  title, 
  subtitle, 
  imageSrc = "/registerImage.jpg" 
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
        {/* Form Section */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="PresCrypt Logo"
              width={130}
              height={40}
              className="object-contain"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-teal-700 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-center text-gray-600 mb-6">{subtitle}</p>
          )}
          
          {children}
        </div>

        {/* Image Section */}
        <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center p-6">
          <div className="relative w-full h-64">
            <Image
              src={imageSrc}
              alt="Registration Illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}