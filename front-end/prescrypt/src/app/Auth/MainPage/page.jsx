"use client";
import React from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../components/MainLayout";
import Header from "../components/MainPageHeader";
import HeroSection from "../components/HeroSection";
import RoleSelection from "../components/RoleSelection";

export default function MainPage() {
  return (
    <MainLayout>
      <Header />
      <HeroSection />
      <RoleSelection />
    </MainLayout>
  );
}