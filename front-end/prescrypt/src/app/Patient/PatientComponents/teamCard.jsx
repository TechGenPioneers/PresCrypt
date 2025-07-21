
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Dewmin Deniyegedara",
    email: "dewminkasmitha30@gmail.com",
    phone: "+94 76 502 3921",
    photo: "/team/Dewmin.jpeg",
    status: "2nd Year Undergraduate at UOM"
  },
  {
    name: "Tharushi De Silva",
    email: "desilva.tharushiw@gmail.com",
    phone: "+94 71 137 4744",
    photo: "/team/Tharushi.jpeg",
    status: "2nd Year Undergraduate at UOM"
  },
  {
    name: "Ravindu Dilshan",
    email: "ravndu.dilshan@gmail.com",
    phone: "+94 71 296 7477",
    photo: "/team/Ravindu.jpeg",
    status: "2nd Year Undergraduate at UOM"
  },
  {
    name: "Navoda Chathurya",
    email: "navodachathurya2001@gmail.com",
    phone: "+94 76 208 5246",
    photo: "/team/Navoda.jpeg",
    status: "2nd Year Undergraduate at UOM"
  },
  {
    name: "Nishara Jayakody",
    email: "dthnjayakody@gmail.com",
    phone: "+94 71 499 9090",
    photo: "/team/Nishara.jpeg",
    status: "2nd Year Undergraduate at UOM"
  },
];

const TeamCard = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-teal-700">
        Meet Our Team Behind PresCrypt
      </h2>

      {/* First row: 3 cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {teamMembers.slice(0, 3).map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white border-2 border-teal-600 text-teal-700 shadow-lg rounded-2xl p-4 w-80 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <Image
              src={member.photo}
              alt={member.name}
              width={300}
              height={300}
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm">{member.email}</p>
              <p className="text-sm">{member.phone}</p>
              <p className="text-sm">{member.status}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Second row: center 2 cards */}
      <div className="flex justify-center gap-6">
        {teamMembers.slice(3).map((member, index) => (
          <motion.div
            key={index + 3}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (index + 3) * 0.2 }}
            className="bg-white border-2 border-teal-600 text-teal-700 shadow-lg rounded-2xl p-4 w-80 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <Image
              src={member.photo}
              alt={member.name}
              width={300}
              height={300}
              className="rounded-xl object-cover w-full h-48"
            />
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-sm">{member.email}</p>
              <p className="text-sm">{member.phone}</p>
              <p className="text-sm">{member.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
