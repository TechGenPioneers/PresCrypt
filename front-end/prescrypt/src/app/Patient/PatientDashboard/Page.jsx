import Footer from "../../Components/footer/Footer";
import Header from "../../Components/header/Header";
import NavBar from "../PatientComponents/navBar";
import PatientDashboard from "../PatientComponents/patientDashboard";
import Link from "next/link"; // Import the Link component
import Image from "next/image";

import React from "react";

export default function Home() {
  return (
    <div>
      <Header/>
      <NavBar/>
      <PatientDashboard />
      <Footer/>
    </div>
  );
}
