"use client";
import React, { useState, useEffect } from "react";

export default function DateTimeDisplay({ title }) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const date = new Date();
      const options = { weekday: "long", day: "numeric", month: "long" };
      let formattedDate = date.toLocaleDateString("en-GB", options);

      // Add suffix for the day (1st, 2nd, 3rd, etc.)
      const day = date.getDate();
      let suffix;

      if (day >= 11 && day <= 13) {
        suffix = "th";
      } else {
        switch (day % 10) {
          case 1:
            suffix = "st";
            break;
          case 2:
            suffix = "nd";
            break;
          case 3:
            suffix = "rd";
            break;
          default:
            suffix = "th";
            break;
        }
      }
      formattedDate = formattedDate.replace(day, day + suffix);
      setFormattedDate(formattedDate);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      <p className="font-bold pt-5 pl-5 text-[27px]">{title}</p>
      <p className="text-[12px] pl-5 text-[#09424D]">{formattedDate}</p>
    </div>
  );
}
