import Footer from "../Components/footer/Footer";
import Header from "../Components/header/Header";
import styles from "../page.module.css";
import Link from "next/link"; // Import the Link component
import Image from "next/image";

import React from "react";

export default function Home() {
  return (
    <div>
      <div className=" min-h-screen">
        <Header />
        {/* User Header Section */}
        <div className=" bg-white flex items-center justify-center space-x-4 mb-8 mt-10">
          <div className="w-20 h-20  ">
            <Image
              src="/profile.png" // Place in public/pics/userpic.jpg
              alt="User Avatar"
              width={500}
              height={500}
              objectFit="cover"
              className="rounded-full "
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#042059]">Hi Kayle!</h1>
            <p className="text-[#042059] text-2xl font-bold">
              Welcome to your personal health Hub.
            </p>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="flex justify-center bg-[#ECECEC] p-10 pt-18 pb-18 m-0">
          <div className=" w-1/2 grid gap-6 md:grid-cols-1">
            <div className="relative group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition outline-4 outline-white ">
              <div className="relative h-48">
                <Image
                  src="/image24.png" // Place in public/images/book-appointment.jpg
                  alt="Book Appointment"
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                />
              </div>
              <div className="absolute bottom-0 w-full bg-[#0A7379] opacity-75 text-white text-lg font-semibold text-center m-1 pb-5 pt-5 py-2 group-hover:bg-opacity-80 transition rounded-2xl">
                Book Appointment
              </div>
            </div>
            <div className="relative group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition outline-4 outline-white ">
              <div className="relative h-48">
                <Image
                  src="/image.png" // Place in public/images/health-records.jpg
                  alt="Health Records"
                  fill={true}
                  objectFit="cover"
                  quality={80}
                />
              </div>
              <div className="absolute bottom-0 w-full bg-[#0A7379] opacity-75 text-white text-lg font-semibold text-center m-1 pb-5 pt-5 py-2 group-hover:bg-opacity-80 transition rounded-2xl">
                Health Records
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <button className="cursor-pointer absolute bottom-5 right-5">
            <img src="/image18.png" className="w-16 h-16" alt="chat-icon" />
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}
