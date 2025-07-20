"use client";
import React, { useState, useEffect } from "react";

export default function DateTimeDisplay() {
  const [shortDate, setShortDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();

      // Format short date as "09/03/2025"
      const shortDate = date.toLocaleDateString("en-GB").replace(/\//g, "/");

      // Format time as "10:48 AM"
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const time = `${(hours % 12 || 12).toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      setShortDate(shortDate);
      setTime(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <div className="absolute text-[15px] bottom-4 right-6 text-[#09424D]">
        <p>{shortDate}</p>
        <p>{time}</p>
      </div>
    </div>
  );
}
