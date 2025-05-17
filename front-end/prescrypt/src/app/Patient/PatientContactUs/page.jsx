"use client";
import ContactUsForm from "../PatientComponents/patientContactUsForm";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";
import Chatbot from "../ChatbotComponents/chatbot";
import useAuthGuard from "@/utils/useAuthGuard";

const ContactUsPage = () => {
  useAuthGuard(["Patient"]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-10 px-4">
        <ContactUsForm />
      </main>
      <NavBar />
      <Chatbot />
      <Footer />
    </div>
  );
};

export default ContactUsPage;
