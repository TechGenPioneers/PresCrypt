import React from "react";
import styles from "./patientAppointments.module.css";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/Footer";

export default function Appointments() {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.appointmentsPage}>
        <div className={styles.searchSection}>
          <h2>Search for available appointments</h2>
          <div className={styles.searchFields}>
            <input
              type="text"
              placeholder="Search for available appointments"
              className={styles.inputField}
            />
            <input
              type="text"
              placeholder="Location or remote appointment"
              className={styles.inputField}
            />
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.moreOptionsButton}>More options</button>
            <button className={styles.calendarButton}>Calendar</button>
          </div>
        </div>
        <div className={styles.appointmentsContent}>
          <div className={styles.calendar}>
            <h3>By available appointments</h3>
            <div className={styles.calendarDetails}>
              <p>Calendar goes here</p>
            </div>
          </div>
          <div className={styles.appointmentList}>
            <h3>Appointments</h3>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={styles.appointmentCard}>
                <img
                  src="https://png.pngtree.com/png-clipart/20240323/original/pngtree-professional-doctor-with-stethoscope-png-image_14666123.png"
                  alt="Doctor"
                  className={styles.doctorImage}
                />
                <div className={styles.doctorDetails}>
                  <p>
                    <strong>Dr. Nimal De Silva</strong>
                  </p>
                  <p>Remote Appointment only</p>
                </div>
                <div className={styles.timeAndButton}>
                  <p>Today 16:15</p>
                  <button className={styles.bookButton}>Book</button>
                </div>
              </div>
            ))}
            <button className={styles.loadMoreButton}>Load more</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
