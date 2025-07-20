"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "./Components/MainPage/MainPageHeader";
import HeroSection from "./Components/MainPage/HeroSection";
import RoleSelection from "./Components/MainPage/RoleSelection";
import HealthcareAnimatedBackground from "./Components/MainPage/AnimatedWaveBackground";

export default function MainPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Animated Background */}
      <HealthcareAnimatedBackground />
      
      {/* Centered Content Container with Glass Effect */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="backdrop-blur-md bg-white/25 border border-white/30 rounded-3xl shadow-2xl shadow-teal-500/10 p-8 md:p-12">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-teal-50/20 rounded-3xl pointer-events-none"></div>
            
            {/* Content */}
            <div className="relative z-10 space-y-8">
              <Header />
              <HeroSection />
              <RoleSelection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}