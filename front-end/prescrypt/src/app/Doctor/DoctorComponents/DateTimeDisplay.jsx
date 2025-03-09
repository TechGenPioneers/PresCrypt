"use client";
import React, { useState, useEffect } from "react";

export default function DateTimeDisplay({ title }) {
  const [formattedDate, setFormattedDate] = useState("");
  const [shortDate, setShortDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const options = { weekday: "long", day: "numeric", month: "long" };
      let formattedDate = date.toLocaleDateString("en-GB", options);

      // Add suffix for the day (1st, 2nd, 3rd, etc.)
      const day = date.getDate();
      const suffix = ["st", "nd", "rd", "th"][
        day % 10 <= 3 && (day < 11 || day > 13) ? day % 10 : 3
      ];
      formattedDate = formattedDate.replace(day, day + suffix);

      // Format short date as "09/03/2025"
      const shortDate = date.toLocaleDateString("en-GB").replace(/\//g, "/");

      // Format time as "10:48 AM"
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const time = `${(hours % 12 || 12).toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      setFormattedDate(formattedDate);
      setShortDate(shortDate);
      setTime(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <p className="font-bold pt-5 pl-5 text-[27px]">{title}</p>
      <p className="text-[12px] pl-5 text-[#09424D]">{formattedDate}</p>
      <div className="text-[15px] pl-5 pt-1 text-[#09424D] absolute bottom-16 right-6">
        <p>{shortDate}</p>
        <p>{time}</p>
      </div>
    </div>
  );
}
