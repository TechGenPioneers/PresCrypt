import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-white via-[rgba(0,126,133,0.3)] to-[rgba(0,126,133,0.5)] p-8 py-4 ml-10 mt-0">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left Side: Logo and Copyright */}
          <div className="grid grid-cols-1 ml-15">
            <div className="flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="PresCrypt Logo"
                width={110}
                height={100}
                className="mr-2"
              />
            </div>
            <div className="justify-end">
              <p className="text-gray-600 text-sm block">
                Copyright © PresCrypt. All Rights Reserved
              </p>
            </div>
          </div>

          {/* Right Side: Links */}
          <div>
            <ul className="space-x-4">
              <li>
                <Link
                  href="/Doctor/DoctorContactUs"
                  className="text-gray-600 hover:text-gray-800 font-bold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/Doctor/DoctorHelpUs"
                  className="text-gray-600 hover:text-gray-800 font-bold"
                >
                  Help Us
                </Link>
              </li>
              <li>
                <Link
                  href="/Doctor/DoctorAboutUs"
                  className="text-gray-600 hover:text-gray-800 font-bold"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
