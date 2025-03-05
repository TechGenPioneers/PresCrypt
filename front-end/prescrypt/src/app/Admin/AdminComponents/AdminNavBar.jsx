"use client";
import {
  LogOut,
  Users,
  UserPlus,
  ClipboardList,
  LayoutDashboard,
  User,
} from "lucide-react";
import { useState } from "react";

const AdminNavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { icon: <LayoutDashboard />, text: "Dashboard", image: "/image11.png" },
    { icon: <Users />, text: "Patients", image: "/image12.png" },
    { icon: <UserPlus />, text: "Doctors", image: "image19.png" },
    { icon: <ClipboardList />, text: "Reports", image: "image20.png" },
  ];

  return (
    <aside
      className={`bg-white p-4 shadow-md flex flex-col items-center justify-between min-h-screen transition-all duration-300 ease-in-out fixed left-0 top-0 h-full ${
        isExpanded ? "w-64" : "w-25"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="w-28 h-13 mt-4" />

      {/* User Avatar and Name */}
      <div className="flex flex-col items-center mt-[-50PX]">
        <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden relative">
          <img
            src="/profile.png"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
        {isExpanded && <div className="mt-2">Nimal Perera</div>}
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-6 mt-[-50px] ">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={`w-12 h-12 justify-center
                flex items-center p-2 rounded-full hover:bg-gray-100  ${
              isExpanded
                ? "justify-star space-x-3 cursor-pointer"
                : "justify-center rounded-full border-2 border-gray-300"
            }`}
          >
            {/*<item.icon className="text-gray-600 w-5 h-5" />*/}
            {!isExpanded && (
              <img src={item.image} className="text-gray-600 w-5 h-5" />
            )}
            {isExpanded && (
              <span className="rounded-full border-2 border-gray-300 hover:bg-gray-100 py-0 px-4 flex items-center space-x-3">
                <div className="flex items-center space-x-3 py-2 mx-10">
                  <img
                    className="w-5 h-5 object-fill"
                    src={item.image}
                    alt={item.text}
                    quality={80}
                  />
                  <div className="text-lg">{item.text}</div>
                </div>
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        className={`flex items-center p-2 rounded-full border-2 border-red-600 hover:bg-red-100 mb-10 ${
          isExpanded
            ? "justify-start space-x-3 cursor-pointer"
            : "justify-center "
        }`}
      >
        {!isExpanded && <LogOut className="text-red-600 w-5 h-5" />}
        {isExpanded && (
          <span className="rounded-md hover:bg-red-100 py-0 px-4 flex items-center space-x-3 ">
              <LogOut className="text-red-600 w-5 h-5" />
              <div className="text-lg">Logout</div>
          </span>
        )}
      </button>
    </aside>
  );
};
export default AdminNavBar;
