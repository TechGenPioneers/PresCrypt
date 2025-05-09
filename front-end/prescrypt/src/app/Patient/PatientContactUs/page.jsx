import ContactUsForm from "../PatientComponents/patientContactUsForm";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";
import NavBar from "../PatientComponents/navBar";

const ContactUsPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow py-10 px-4">
        <ContactUsForm />
      </main>
      <NavBar/>

      <Footer />
    </div>
  );
};

export default ContactUsPage;
