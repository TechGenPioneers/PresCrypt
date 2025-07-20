import React from 'react';
import Image from "next/image";
import HealthcareAnimatedBackground from "../../Components/MainPage/AnimatedWaveBackground";  
export default function RegistrationLayout({ 
  children, 
  title, 
  subtitle, 
  imageSrc = "/registerImage.jpg" 
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Animated Background */}
      <HealthcareAnimatedBackground />
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/80 p-4">
      
      <div className="bg-white/80  rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-5xl z-10">
        {/* Form Section */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex justify-center mb-5 ">
            <Image
              src="/logo.png"
              alt="PresCrypt Logo"
              width={90}
              height={20}
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
        <div className="hidden md:flex flex-1 bg-white/50 items-center justify-center p-6 z-17">
          <div className="relative w-full h-84">
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
    </div>
  );
}