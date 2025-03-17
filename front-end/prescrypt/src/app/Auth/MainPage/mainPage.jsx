"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-white text-gray-700">
      {/* Header with Logo & Login */}
      <header className="w-full flex justify-between items-center p-6">
        <Image src="/logo.png" alt="PresCrypt Logo" width={150} height={50} />
        <button
          onClick={() => router.push("/Auth")}
          className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
        >
          LOG IN
        </button>
      </header>

      {/* Main Content */}
      <main className="text-center px-6">
        <h1 className="text-4xl font-bold">
          Our <span className="text-green-500">Health</span> Journey{" "}
          <span className="text-blue-500">Starts Here!</span>
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          At <span className="text-blue-500 font-semibold">PresCrypt</span>, we offer a 
          comprehensive suite of healthcare services designed to make managing 
          your health easier and more efficient. Whether you are a{" "}
          <span className="text-blue-500">Patient, Doctor, or Administrator</span>, 
          we have solutions to meet your needs.
        </p>

        {/* Role Selection Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/Patient/register")}
            className="border border-green-500 text-green-500 px-6 py-2 rounded-lg hover:bg-green-500 hover:text-white transition"
          >
            PATIENT
          </button>
          <button
            onClick={() => router.push("/Doctor/register")}
            className="border border-blue-500 text-blue-500 px-6 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition"
          >
            DOCTOR
          </button>
        </div>
      </main>

      {/* Footer */}
   
    </div>
  );
}
