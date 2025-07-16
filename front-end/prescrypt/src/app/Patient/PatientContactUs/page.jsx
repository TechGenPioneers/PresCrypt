"use client";
import ContactUsForm from "../PatientComponents/patientContactUsForm";
import useAuthGuard from "@/utils/useAuthGuard";

const ContactUsPage = () => {
  useAuthGuard(["Patient"]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow py-10 px-4">
        <ContactUsForm />
      </main>
    </div>
  );
};

export default ContactUsPage;
