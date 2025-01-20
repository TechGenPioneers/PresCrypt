// src/app/Components/Header/Header.js
import React from "react";
import Link from "next/link";
import styles from "./header.modules.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/" passHref legacyBehavior>
          <a>
            <img src="/logo.png" alt="PresCrypt Logo" className={styles.logoImage} />
          </a>
        </Link>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link href="/patient/profile" passHref legacyBehavior>
              <a>Profile</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/appointment" passHref legacyBehavior>
              <a>Appointments</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/chat" passHref legacyBehavior>
              <a>Chat</a>
            </Link>
          </li>
          <li>
            <Link href="/patient/home" passHref legacyBehavior>
              <a>Dashboard</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
