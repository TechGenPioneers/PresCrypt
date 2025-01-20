// src/pages/patient/profile.js
import React from "react";
import styles from "./patientprofile.module.css";
import Footer from "../../Components/footer/Footer";
import Header from "../../Components/header/Header";

export default function PatientProfile() {
  return (
    <div className={styles.container}>
        <Header />
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <img
            src="/profile.jpg"
            alt="Patient"
            className={styles.profileImage}
          />
          <div className={styles.contactDetails}>
            <h2>Ms Kayle Fernando</h2>
            <p>📞 +94 713456784 / 052656712</p>
            <p>📧 kaylefernan67@gmail.com</p>
            <p>📍 No 67, Temple Street, Kollpitiya, Colombo</p>
            <button className={styles.addPrescriptionButton}>
              Add Prescription
            </button>
          </div>
        </div>
        <div className={styles.healthOverview}>
          <h3>Health Overview</h3>
          <div className={styles.overviewDetails}>
            <div className={styles.detailCard}>Gender: Female</div>
            <div className={styles.detailCard}>DOB: 1999.08.01</div>
            <div className={styles.detailCard}>Blood Group: O+</div>
            <div className={styles.detailCard}>Height: 160 cm</div>
            <div className={styles.detailCard}>Weight: 42 kg</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
