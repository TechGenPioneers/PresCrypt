import React from "react";
import Footer from "../../Components/footer/Footer";
import Sidebar from "../DoctorComponents/DoctorSidebar";
import DateTimeDisplay from "../DoctorComponents/DateTimeDisplay"; 

export default function page() {
  const Title = "Patients"; // Dynamic title for each page

  return (
    <div className="flex flex-col min-h-screen ml-32">
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-2 bg-[#D4E9EA] min-h-screen">
          <div className="m-[0.1px] bg-white h-full w-full">
            <DateTimeDisplay title={Title} /> {/* Pass the dynamic title */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}