
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MainLayout from "./Components/MainPage/MainLayout";
import Header from "./Components/MainPage/MainPageHeader";
import HeroSection from "./Components/MainPage/HeroSection";
import RoleSelection from "./Components/MainPage/RoleSelection";

export default function MainPage() {
  return (
    <MainLayout>
      <Header />
      <HeroSection />
      <RoleSelection />
    </MainLayout>
  );
}