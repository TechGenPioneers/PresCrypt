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
import { useRouter } from "next/navigation";
import axios from "axios";
import { usePathname } from "next/navigation";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog"; // Import the component

const AdminNavBar = ({ adminName }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // Add state for dialog
  const router = useRouter();

  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(-1);

  // Set active index on mount and when path changes
  useEffect(() => {
    const index = navItems.findIndex((item) => item.link === pathname);
    setActiveIndex(index);
  }, [pathname]);

  const navItems = [
    { text: "Dashboard", image: "/image11.png", link: "/Admin/AdminDashboard" },
    { text: "Patients", image: "/image12.png", link: "/Admin/AdminPatient" },
    {
      text: "Requests",
      image: "/image27.png",
      link: "/Admin/DoctorRequestPage",
    },
    { text: "Doctors", image: "/image19.png", link: "/Admin/AdminDoctor" },
    {
      text: "Reports",
      image: "/image20.png",
      link: "/Admin/AdminReportGeneratorPage",
    },
    { text: "Message", image: "/message.png", link: "/Admin/AdminMessage" },
  ];

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    
    try {
      await axios.post("https://localhost:7021/api/User/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.warn("Backend logout failed (may not be using cookies):", err);
    }

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    router.push("/Auth/login");
  };

  return (
    <>
      <aside
        className={`bg-white p-4 shadow-md flex flex-col items-center justify-between min-h-screen transition-all duration-100 ease-in-out fixed left-0 top-0 h-full ${
          isExpanded ? "w-64 z-10" : "w-25 z-10"
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="w-28 h-13 mt-4" />

        {/* User Avatar and Name */}
        <div className="flex flex-col items-center">
          
          {isExpanded && <div className="mt-2">{adminName}</div>}
        </div>

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-6 ">
          {navItems.map((item, index) => (
            <Link key={index} href={item.link || "#"} passHref>
              <button
                onClick={() => setActiveIndex(index)}
                className={`w-12 h-12 justify-center
                  flex items-center p-2 rounded-full hover:bg-gray-100  ${
                    isExpanded
                      ? "justify-star space-x-3 cursor-pointer"
                      : "justify-center rounded-full border-2 border-gray-300"
                  }
                    ${
                      !isExpanded && activeIndex === index
                        ? "bg-[#9debc6] text-gray-600"
                        : "bg-transparent"
                    }`}
              >
                {/*<item.icon className="text-gray-600 w-5 h-5" />*/}
                {!isExpanded && (
                  <img src={item.image} className="text-gray-600 w-5 h-5" />
                )}

                {isExpanded && (
                  // <span className="rounded-full border-2 border-gray-300 hover:bg-gray-100 py-0 px-4 flex items-center space-x-3">
                  <span
                    className={`rounded-full border-2 border-gray-300 hover:bg-gray-100 py-0 px-4 flex items-center space-x-3
                  ${
                    activeIndex === index
                      ? "bg-[#9debc6] text-gray-600"
                      : "bg-transparent"
                  }`}
                  >
                    <div className="flex items-center space-x-3 py-2 mx-10">
                      <img
                        className="w-5 h-5 object-fill"
                        src={item.image}
                        alt={item.text}
                        quality={80}
                      />
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
          onClick={handleLogoutClick}
          className={`flex items-center p-2 rounded-full border-2 border-red-600 hover:bg-red-100 mt-2 mb-2 ${
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

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmationDialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Admin Logout"
        message="Are you sure you want to log out of your admin account? You'll need to sign in again to access the admin dashboard."
      />
    </>
  );
};

export default AdminNavBar;