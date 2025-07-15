// components/sections/Header.jsx
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full max-w-6xl mb-8">
      <div className="logo">
        <Image
          src="/logo.png"
          alt="PresCrypt Logo"
          width={150}
          height={50}
          className="h-20 object-contain"
        />
      </div>
      <Link href="./Auth/login">
        <button className="bg-white text-teal-700 border-2 border-teal-700 px-6 py-2 text-lg font-bold rounded-full hover:bg-teal-50 transition-all">
          Login
        </button>
      </Link>
    </header>
  );
}