"use client";
import ContactUsForm from "./DoctorContactUsForm";
import useAuthGuard from "@/utils/useAuthGuard";

const ContactUsPage = () => {
  useAuthGuard("Doctor"); // Ensure the user is authenticated as a Doctor
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-10 px-4">
        <ContactUsForm />
      </main>
    </div>
  );
};

export default ContactUsPage;
