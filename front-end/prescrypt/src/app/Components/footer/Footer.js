import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#004d40",
        color: "#fff",
        padding: "1rem 2rem",
        marginTop: "2rem",
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ margin: 0 }}>
          Copyright © 2025 PrescCrypt | All Rights Reserved
          Copyright © 2025 PrescCrypt | All Rights Reserved
        </p>
        <div style={{ marginTop: "0.5rem" }}>
          <a href="/help" style={{ color: "#80cbc4", margin: "0 0.5rem" }}>
            Getting Started
          </a>
          <a href="/support" style={{ color: "#80cbc4", margin: "0 0.5rem" }}>
            Help Center
          </a>
          <a href="/status" style={{ color: "#80cbc4", margin: "0 0.5rem" }}>
            Server Status
          </a>
          <a href="/bugs" style={{ color: "#80cbc4", margin: "0 0.5rem" }}>
            Report a Bug
          </a>
        </div>
      </div>
    </footer>
  );
}
