"use client";
import React from "react";
import useAuthGuard from "@/utils/useAuthGuard";
import PatientDashboardSection from "../PatientComponents/patientDashboard";

export default function Home() {
  useAuthGuard(["Patient"]);

  return (
    <main className="flex-grow p-5">
      <PatientDashboardSection />
    </main>
  );
}
