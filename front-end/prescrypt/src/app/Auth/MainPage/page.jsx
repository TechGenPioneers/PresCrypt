import styles from "./mainPage.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MainPage() {
  return (
    <div className={styles.container}>
      {/* Header - Logo and Login Button */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.png"
            alt="PresCrypt Logo"
            width={150}
            height={50}
          />
        </div>
        {/* Default to patient role for the top login button */}
        <Link href="./Login">
          <button className={styles.loginBtn}>Login</button>
        </Link>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Side - Text */}
        <section className={styles.textSection}>
          <h2 className={styles.title}>
            Our <span className={styles.highlight}>Health</span> Journey{" "}
            <span className={styles.highlight}>Starts Here!</span>
          </h2>
          <p className={styles.description}>
            At <span className={styles.brand}>PresCrypt</span>, we offer a comprehensive
            suite of healthcare services designed to make managing your health
            easier and more efficient. Whether you are a{" "}
            <span className={styles.linkText}>Patient, Doctor, or Administrator</span>,
            we have solutions to meet your needs.
          </p>
        </section>

        {/* Right Side - Image */}
        <section className={styles.imageContainer}>
          <Image
            src="/mainpageImage.png"
            alt="Doctor and Patient"
            width={450}
            height={350}
          />
        </section>
      </div>

      {/* Centered Button Section */}
      <div className={styles.buttonSection}>
        <h3 className={styles.subtext}>Continue Your Journey As A</h3>
        <div className={styles.btnGroup}>
          <Link href="./Login?role=patient">
            <button className={styles.patientBtn}>Patient</button>
          </Link>
          <Link href="./Login?role=doctor">
            <button className={styles.doctorBtn}>Doctor</button>
          </Link>
        </div>
      </div>
     
    </div>
  );
}