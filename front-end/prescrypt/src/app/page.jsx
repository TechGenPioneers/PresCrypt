
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MainLayout from "./Components/MainPage/MainLayout";
import Header from "./Components/MainPage/MainPageHeader";
import HeroSection from "./Components/MainPage/HeroSection";
import RoleSelection from "./Components/MainPage/RoleSelection";
//import VantaWavesBackground from "./Components/MainPage/vantawavesbackground";
export default function MainPage() {

  return (
//      <div className="relative min-h-screen overflow-hidden">
//       <VantaWavesBackground />
// <div className="relative z-10">
        <MainLayout>
          <Header />
          <HeroSection />
          <RoleSelection />
        </MainLayout>
    //   </div>
    // </div>
  );
}