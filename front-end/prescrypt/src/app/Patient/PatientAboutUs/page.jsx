"use client";
import TeamCard from "../PatientComponents/teamCard";
import React from "react";

export default function TeamPage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: "url('/BGImage.png')" }}
      ></div>

     
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow">
          <TeamCard />
        </main>
      </div>
    </div>
  );
}
