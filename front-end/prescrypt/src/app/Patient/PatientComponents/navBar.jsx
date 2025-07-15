"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfileImage, getPatientDetails } from "../services/PatientDataService";
import axios from "axios";

const PatientNavBar = () => {
  const [patientId, setPatientId] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [patientName, setPatientName] = useState("Patient Profile");
  const [joinDate, setJoinDate] = useState("31 December 1999");
  const router = useRouter();

  // Load patientId from localStorage
  useEffect(() => {
    const loadPatientId = () => {
      const id = localStorage.getItem("patientId");
      if (id && id !== patientId) {
        setPatientId(id);
      }
    };

    loadPatientId();

    const onStorageChange = (e) => {
      if (e.key === "patientId") {
        loadPatientId();
      }
    };

    window.addEventListener("storage", onStorageChange);
    const interval = setInterval(loadPatientId, 1000); // for same-tab updates

    return () => {
      window.removeEventListener("storage", onStorageChange);
      clearInterval(interval);
    };
  }, [patientId]);

  // Fetch patient data once patientId is available
    useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;

      try {
        const image = await getProfileImage(patientId);
        const { name, createdAt } = await getPatientDetails(patientId);

        setProfileImage(image || "/profile.png");
        setPatientName(name);

        const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        setJoinDate(formattedDate);
      } catch (error) {
        console.error("Error loading patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);


  const handleLogout = async () => {
    const ok = window.confirm("Are you sure you want to log out?");
    if (!ok) return;

    try {
      await axios.post(
        "https://localhost:7021/api/User/logout",
        null,
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Backend logout failed (may not be using cookies):", err);
    }

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("patientId");
    router.push("/Auth/login");
  };

  const navItems = [
    { text: "Dashboard", icon: "/image11.png", link: "/Patient/PatientDashboard" },
    { text: "Profile", icon: "/image12.png", link: "/Patient/PatientProfile" },
    { text: "Appointments", icon: "/image27.png", link: "/Patient/PatientAppointments" },
    { text: "Health Records", icon: "/image19.png", link: "/Patient/PatientHealthRecords" },
    { text: "Chat with doctor", icon: "/image20.png", link: "/Patient/PatientChat" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 group hover:w-[260px] w-[90px] flex flex-col justify-between">
      {/* Profile Section */}
      <div className="flex flex-col items-center px-4 pt-16">
        <img
          src={profileImage}
          alt="Profile"
          className="w-16 h-16 rounded-full border-2 border-gray-300 object-cover mb-2"
        />
        <div className="h-[45px] overflow-hidden transition-all duration-300 w-full text-center group-hover:text-left">
          <h2 className="text-sm font-semibold text-[#047857] whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
            {patientName}
          </h2>
          <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Joined: {joinDate}
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col space-y-2 mt-6 px-3">
        {navItems.map((item, index) => (
          <Link key={index} href={item.link} passHref>
            <div className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-[#E9FAF2] hover:border-[#047857] transition-all cursor-pointer w-full">
              <img src={item.icon} alt={item.text} className="w-5 h-5 shrink-0" />
              <span className="ml-4 text-sm text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.text}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="ml-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default PatientNavBar;
