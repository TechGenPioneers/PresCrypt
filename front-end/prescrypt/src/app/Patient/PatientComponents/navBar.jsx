"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProfileImage, getPatientDetails } from "../services/PatientDataService";
import axios from "axios";
import { usePathname } from "next/navigation";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const PatientNavBar = () => {
  const [patientId, setPatientId] = useState(null);
  const [profileImage, setProfileImage] = useState("/profile.png");
  const [patientName, setPatientName] = useState("Patient Profile");
  const [joinDate, setJoinDate] = useState("31 December 1999");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
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
    <>
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
                onClick={handleLogoutClick}
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

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
        PaperProps={{
          className: "rounded-2xl shadow-2xl border-0",
          style: {
            minWidth: '400px',
            padding: '8px'
          }
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }
        }}
      >
        <DialogTitle 
          id="logout-dialog-title" 
          className="text-center pb-2"
          style={{ 
            color: '#033A3D',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            paddingTop: '24px'
          }}
        >
          <div className="flex items-center justify-center mb-2">
            <WarningAmberIcon 
              style={{ 
                fontSize: '2.5rem', 
                color: '#f59e0b',
                marginRight: '8px'
              }} 
            />
          </div>
          Confirm Logout
        </DialogTitle>
        
        <DialogContent className="text-center px-6">
          <DialogContentText 
            id="logout-dialog-description"
            style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              lineHeight: '1.6'
            }}
          >
            Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions className="justify-center gap-4 pb-6 px-6">
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            className="px-8 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold text-base min-w-[120px]"
            style={{
              textTransform: 'none',
              borderColor: '#d1d5db',
              color: '#374151'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            startIcon={<LogoutIcon />}
            className="px-8 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-all duration-300 font-semibold text-base min-w-[120px] shadow-lg hover:shadow-xl"
            style={{
              textTransform: 'none',
              backgroundColor: '#ef4444',
              boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.3)'
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PatientNavBar;