// src/app/page.js
import React from "react";
import Home from "./Pages/Home";
import HealthRecord from "./Pages/HealthRecord";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/HealthRecord" element={<HealthRecord />} />
      </Routes>
    </Router>
  );
}