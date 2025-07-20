"use client";
import TeamCard from "../PatientComponents/teamCard";
import React from "react";

export default function TeamPage() {
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
