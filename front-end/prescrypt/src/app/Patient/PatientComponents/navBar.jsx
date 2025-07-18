"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfileImage, getPatientDetails } from "../services/PatientDataService";
import axios from "axios";
import { usePathname } from "next/navigation";

const PatientNavBar = () => {
  const [patientId, setPatientId] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [patientName, setPatientName] = useState("Patient Profile");
  const [joinDate, setJoinDate] = useState("31 December 1999");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadPatientId = () => {
      const id = localStorage.getItem("patientId");
      if (id && id !== patientId) {
        setPatientId(id);
      }
    };

    loadPatientId();
    const onStorageChange = (e) => {
      if (e.key === "patientId") loadPatientId();
    };

    window.addEventListener("storage", onStorageChange);
    const interval = setInterval(loadPatientId, 1000);

    return () => {
      window.removeEventListener("storage", onStorageChange);
      clearInterval(interval);
    };
  }, [patientId]);

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
      await axios.post("https://localhost:7021/api/User/logout", null, {
        withCredentials: true,
      });
    } catch (err) {
      console.warn("Backend logout failed:", err);
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
    { text: "Chat with doctor", icon: "/image20.png", link: "/Communication" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full bg-white shadow-2xl z-50 font-medium font-sans transition-all duration-300 ease-in-out flex flex-col group">
      <div className="group-hover:w-[16rem] w-[6rem] transition-all duration-300 ease-in-out h-full flex flex-col">
        {/* Logo */}
        <div className="flex justify-center items-center mt-4 mb-8">
        {/* Empty placeholder to preserve space */}
        <div className="w-12 h-12" />
      </div>


        {/* Profile */}
        <div className="flex items-center px-2 py-3">
          <img
            src={profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
          />
          <div className="ml-4 whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
            <p className="font-bold text-[#033A3D] text-[17px]">{patientName}</p>
            <p className="text-xs text-gray-500">Joined: {joinDate}</p>
          </div>
        </div>

  
        <nav className="flex flex-col items-center p-2 text-black text-xl font-bold mt-4 flex-grow">
          <ul className="flex flex-col items-center w-full">
            {navItems.map((item, index) => (
              <li key={index} className="mb-4 w-full flex justify-center">
                <Link
                  href={item.link}
                  className={`flex items-center p-2 border-1 rounded-full transition-all duration-300 ${
                    pathname === item.link
                      ? "border-[#033A3D] bg-[#033A3D]/20 text-[#033A3D] font-bold shadow-md"
                      : "border-transparent hover:border-[#033A3D] hover:bg-[#033a3d32] text-black"
                  }`}
                  style={{
                    width: "90%",
                    height: "50px",
                    justifyContent: "flex-start",
                    paddingLeft: "20px",
                    borderRadius: "20px",
                  }}
                >
                  <img src={item.icon} alt={item.text} className="w-5 h-5" />
                  <span className="ml-2 text-[15px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="w-full p-2 mt-5">
          <li className="mb-4 w-full flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 hover:border-1 rounded-full transition-all duration-300 hover:border-[#033A3D] hover:bg-[#033a3d32]"
              style={{
                width: "90%",
                height: "50px",
                justifyContent: "flex-start",
                paddingLeft: "20px",
                borderRadius: "20px",
              }}
            >
              <img src="/image28.png" alt="Logout" className="w-5 h-5" />
              <span className="text-[#033A3D] text-[15px] whitespace-nowrap ml-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Logout
              </span>
            </button>
          </li>
        </div>
      </div>
    </aside>
  );
};

export default PatientNavBar;
