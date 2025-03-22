import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-white via-[rgba(0,126,133,0.3)] to-[rgba(0,126,133,0.5)] p-8 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Side: Logo and Copyright */}
        <div className="grid grid-cols-1 ml-15" >
          <div className="flex items-center justify-center">
            <Image
              src="/logo.png" // Replace with your actual logo path
              alt="PresCrypt Logo"
              width={110} // Adjust as needed
              height={100} // Adjust as needed
              className="mr-2"
            />
          </div>
          <div className="justify-end">
            <p className="text-gray-600 text-sm block">
              Copyright © PresCrypt. All Rights Reserved
            </p>
          </div>
        </div>

        {/* Right Side: Contact, Help, About Us */}
        <div>
          <ul className="space-x-4">
            <li>
              <Link
                href="/contact-us" className="text-gray-600 hover:text-gray-800 font-bold">
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/help-us"
                className="text-gray-600 hover:text-gray-800 font-bold "
              >
                Help Us
              </Link>
            </li>
            <li>
              <Link
                href="/about-us"
                className="text-gray-600 hover:text-gray-800 font-bold "
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
