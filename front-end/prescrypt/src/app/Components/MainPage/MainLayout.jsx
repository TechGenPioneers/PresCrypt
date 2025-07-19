"use client";
import React from "react";
//import Footer from "../../Components/footer/Footer";
export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col max-h-screen bg-white">
      <main className="flex-grow p-8 sm:p-30">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
     
    </div>
  );
}