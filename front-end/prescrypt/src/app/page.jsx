
// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import MainLayout from "./Components/MainPage/MainLayout";
// import Header from "./Components/MainPage/MainPageHeader";
// import HeroSection from "./Components/MainPage/HeroSection";
// import RoleSelection from "./Components/MainPage/RoleSelection";
// //import VantaWavesBackground from "./Components/MainPage/vantawavesbackground";
// export default function MainPage() {

//   return (
//         <MainLayout>
//           <Header />
//           <HeroSection />
//           <RoleSelection />
//         </MainLayout>
   
//   );
// }
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MainLayout from "./Components/MainPage/MainLayout";
import Header from "./Components/MainPage/MainPageHeader";
import HeroSection from "./Components/MainPage/HeroSection";
import RoleSelection from "./Components/MainPage/RoleSelection";
import HealthcareAnimatedBackground from "./Components/MainPage/AnimatedWaveBackground";

export default function MainPage() {
  return (
    <MainLayout>
      <HealthcareAnimatedBackground />
      <div className=" backdrop-blur-lg bg-white/20 bg-origin-padding bg-clip-padding ">
        <Header />
        <HeroSection />
        <RoleSelection />
      </div>
    </MainLayout>
    
  );
}