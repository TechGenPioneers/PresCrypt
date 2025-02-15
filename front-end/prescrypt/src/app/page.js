// src/app/page.js
import React from "react";
import Header from "./Components/header/Header";
import Footer from "./Components/footer/Footer";
import styles from "./page.module.css";
import Link from "next/link";  
export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      {/* Include the reusable Header component */}
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to PresCrypt</h1>
        <p className={styles.description}>
          A platform to manage your healthcare seamlessly.
        </p>
        <div className={styles.actions}>
          {/* Use Next.js Link for routing */}
          <Link href="/Patient/PatientProfile" passHref legacyBehavior>
            <a className={styles.card}>
              <h2>Profile &rarr;</h2>
              <p>View and update your personal profile information.</p>
            </a>
          </Link>
          <Link href="/Patient/PatientAppointments" passHref legacyBehavior>
            <a className={styles.card}>
              <h2>Appointments &rarr;</h2>
              <p>Book, view, or manage your appointments.</p>
            </a>
          </Link>
          <Link href="/Patient/Chat" passHref legacyBehavior>
            <a className={styles.card}>
              <h2>Chat &rarr;</h2>
              <p>Communicate with your healthcare provider.</p>
            </a>
          </Link>
          <Link href="/Patient/Home" passHref legacyBehavior>
            <a className={styles.card}>
              <h2>Dashboard &rarr;</h2>
              <p>Access your dashboard for quick updates.</p>
            </a>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
