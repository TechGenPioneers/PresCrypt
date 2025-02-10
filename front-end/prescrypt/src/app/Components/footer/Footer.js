import React from "react";
import Image from "next/image";
export default function Footer() {
  return (
    <footer className="bg-[#0A7379] text-white">
      <div className="grid md:grid-cols-2 ">
        <div className="relative">
          <div className=" pl-20 pt-15 pb-15">
            <Image
              src="/logo.png"
              alt="logo"
              width={200}
              height={200}
              className="w-26 h-26 sm:w-20 sm:h-25 md:w-28 md:h-28 lg:w-35 lg:h-35"
              quality={80}
              layout="intrinsic"
            />
            <p className="pt-1 text-sm opacity-70">
              Copyright © 2025 |<br /> All Rights Reserved{" "}
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute bottom right-10 pt-10">
            Support
            <ul className="mt-1">
              <li>
                <a href="#">Getting Started</a>
              </li>
              <li>
                <a href="#">Help center</a>
              </li>
              <li>
                <a href="#">Server Status</a>
              </li>
              <li>
                <a href="#">Report a Bug</a>
              </li>
              <li>
                <a href="#">Chat Support</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
