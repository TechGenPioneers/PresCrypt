"use client";

import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Nav from "./PatientComponents/navBar";
import Chatbot from "./ChatbotComponents/chatbot";

export default function PatientLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-0"
        style={{ backgroundImage: "url('/BGImage.png')" }}
      ></div>

      {/* All visible content sits above background */}
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <Nav />
        
        {/* Main page content */}
        <main className="flex-grow p-5">{children}</main>

        <Chatbot />
        <Footer />
      </div>
    </div>
  );
}
