import Image from "next/image";
import Link from "next/link";
import useAuthGuard from "@/utils/useAuthGuard";

const Footer = () => {
  useAuthGuard("Doctor"); // Ensure the user is authenticated as a Doctor
  return (
    <>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-white via-[rgba(0,126,133,0.3)] to-[rgba(0,126,133,0.5)] text-gray-700 p-6 ml-24 mt-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Section: Logo and Copyright */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="PresCrypt Logo"
                  width={110}
                  height={100}
                  className="mr-3"
                />
              </div>
              <p className="text-gray-600 text-sm">
                © 2025 PresCrypt. All rights reserved.
              </p>
            </div>

            {/* Middle Section: Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#033A3D] mb-3">Contact Information</h3>
              
              {/* Address */}
              <div className="flex items-start space-x-3">
                <div className="bg-teal-500 rounded-full p-2 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[#033A3D] font-medium">University of Moratuwa</p>
                  <p className="text-gray-600">Bandaranayake Mawatha, Moratuwa 10400, Sri Lanka</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="bg-teal-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <p className="text-[#033A3D]">+94 762085246</p>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="bg-teal-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <Link href="mailto:prescrypt.health@gmail.com" className="text-teal-600 hover:text-teal-700 transition-colors">
                  prescrypt.health@gmail.com
                </Link>
              </div>
            </div>

            {/* Right Section: About & Navigation Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#033A3D] mb-3">About PresCrypt</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Revolutionizing healthcare through secure digital prescription management. 
                Our platform connects patients, doctors, with cutting-edge technology for better healthcare outcomes.
              </p>

              {/* Navigation Links */}
              <div>
                <h4 className="text-base font-medium text-[#033A3D] mb-2">Quick Links</h4>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/Doctor/DoctorContactUs"
                      className="text-gray-600 hover:text-teal-600 transition-colors duration-200 flex items-center space-x-2 text-sm"
                    >
                      <span>→</span>
                      <span>Contact Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/Doctor/DoctorHelpUs"
                      className="text-gray-600 hover:text-teal-600 transition-colors duration-200 flex items-center space-x-2 text-sm"
                    >
                      <span>→</span>
                      <span>Help Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/Doctor/DoctorAboutUs"
                      className="text-gray-600 hover:text-teal-600 transition-colors duration-200 flex items-center space-x-2 text-sm"
                    >
                      <span>→</span>
                      <span>Our Team</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Border with Made with Heart */}
          <div className="border-t border-teal-200 mt-4 pt-3 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 PresCrypt. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center justify-center space-x-1 mt-1">
              <span>Made with</span>
              <span className="text-red-500 text-base">♥</span>
              <span>by the PresCrypt Team</span>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
