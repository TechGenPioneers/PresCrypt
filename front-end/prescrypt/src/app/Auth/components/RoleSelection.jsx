// components/sections/RoleSelection.jsx
import Link from "next/link";

export default function RoleSelection() {
  return (
    <div className="w-full flex flex-col items-center mt-12">
      <h3 className="text-xl md:text-2xl font-bold text-gray-600 mb-6 text-center">
        Continue Your Journey As A
      </h3>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <Link href="./PatientRegistration">
          <button className="bg-white text-teal-700 border-2 border-teal-700 px-10 py-3 text-lg font-bold rounded-full hover:bg-teal-700 hover:text-white transition-all">
            Patient
          </button>
        </Link>
        <Link href="./DoctorRegistration">
          <button className="bg-white text-teal-700 border-2 border-teal-700 px-10 py-3 text-lg font-bold rounded-full hover:bg-teal-700 hover:text-white transition-all">
            Doctor
          </button>
        </Link>
      </div>
    </div>
  );
}