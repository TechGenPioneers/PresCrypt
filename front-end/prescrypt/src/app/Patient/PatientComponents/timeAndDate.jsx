'use client';

import React, { useEffect, useState } from 'react';

const TimeAndDate = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = time.toISOString().split('T')[0].replace(/-/g, '/'); // "YYYY/MM/DD"
  const formattedTime = time.toLocaleTimeString();

  return (
    <div className="text-sm text-green-700 font-bold text-center mb-1">
      <p>{formattedDate}</p>
      <p>{formattedTime}</p>
    </div>
  );
};

export default TimeAndDate;
