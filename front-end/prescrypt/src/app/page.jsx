// src/app/page.js
import React from "react";
import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./page.module.css";
import Link from "next/link";  
import AdminDoctorsPage from "./Admin/AdminDoctor/page";



export default function Home() {
  return (
    <div>
    <AdminDoctorsPage/>
    {/* <Sample/> */}

    </div>
  );
}
