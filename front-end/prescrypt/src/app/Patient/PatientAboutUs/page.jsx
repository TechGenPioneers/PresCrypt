"use client";
import TeamCard from "../PatientComponents/teamCard";
import React from "react";
import useAuthGuard from "@/utils/useAuthGuard"; // Ensure the user is authenticated as a Patient

export default function TeamPage() {
  useAuthGuard("Patient"); // Ensure the user is authenticated as a Patient
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow">
          <TeamCard />
        </main>
      </div>
    </div>
  );
}
