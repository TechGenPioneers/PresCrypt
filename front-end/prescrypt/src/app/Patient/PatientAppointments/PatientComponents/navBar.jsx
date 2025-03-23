"use client";
import {
  LogOut,
  Users,
  UserPlus,
  ClipboardList,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const AdminNavBar = ({ patientId = "P021" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.png"); // Default placeholder image

  const navItems = [
    { text: "Dashboard", image: "/image11.png", link: "/Patient/PatientDashboard" },
    { text: "Profile", image: "/image12.png", link: "/Patient/PatientProfile" },
    { text: "Appointments", image: "/image27.png", link: "/Patient/PatientAppointments" },
    { text: "Health Records", image: "/image19.png", link: "/Patient/PatientRecords" },
    { text: "Chat with Doctor", image: "/image20.png", link: "/Patient/PatientChat" },
  ];

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7021/api/Patient/profileImage/${patientId}`,
          { responseType: "arraybuffer" } // Ensure we get binary data
        );

        const base64Image = Buffer.from(response.data, "binary").toString("base64");
        setProfileImage(`data:image/jpeg;base64,${base64Image}`);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, [patientId]);

  return (
    <aside
      className={`bg-white p-4 shadow-md flex flex-col items-center justify-between min-h-screen transition-all duration-100 ease-in-out fixed left-0 top-0 h-full ${
        isExpanded ? "w-64 z-10" : "w-25 z-10"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* User Image and Name */}
      <div className="flex flex-col items-center mt-[100px]">
        <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden relative">
          <img
            src={profileImage}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        {isExpanded && <div className="mt-1">Nimal Perera</div>}
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-6 mt-[-50px]">
        {navItems.map((item, index) => (
          <Link key={index} href={item.link || "#"} passHref>
            <button
              onClick={() => setActiveIndex(index)}
              className={`w-12 h-12 justify-center flex items-center p-2 rounded-full hover:bg-gray-100 ${
                isExpanded
                  ? "justify-between space-x-3 cursor-pointer"
                  : "justify-center rounded-full border-2 border-gray-300"
              } ${!isExpanded && activeIndex === index ? "bg-[#E9FAF2] text-gray-600" : "bg-transparent"}`}
            >
              {!isExpanded && <img src={item.image} className="text-gray-600 w-5 h-5" />}
              {isExpanded && (
                <span
                  className={`rounded-full border-2 border-gray-300 hover:bg-green-50 py-0 px-4 flex items-center space-x-3 ${
                    activeIndex === index ? "bg-[#E9FAF2] text-grey-600" : "bg-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3 py-2 mx-5">
                    <img className="w-5 h-5 object-fill" src={item.image} alt={item.text} quality={80} />
                    <div className="text-lg p-0 m-0">{item.text}</div>
                  </div>
                </span>
              )}
            </button>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        className={`flex items-center p-2 rounded-full border-2 border-red-600 hover:bg-red-100 mb-10 ${
          isExpanded ? "justify-start space-x-3 cursor-pointer" : "justify-center "
        }`}
      >
        {!isExpanded && <LogOut className="text-red-600 w-5 h-5" />}
        {isExpanded && (
          <span className="rounded-md hover:bg-red-100 py-0 px-4 flex items-center space-x-3">
            <LogOut className="text-red-600 w-5 h-5" />
            <div className="text-lg">Logout</div>
          </span>
        )}
      </button>
    </aside>
  );
};

export default AdminNavBar;
