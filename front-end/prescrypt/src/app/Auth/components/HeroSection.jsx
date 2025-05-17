// components/sections/HeroSection.jsx
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl gap-8">
    
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Our <span className="text-teal-600">Health</span> Journey{" "}
            <span className="text-teal-600">Starts Here!</span>
          </h2>
          <p className="text-lg md:text-x text-gray-600 mt-3 leading-relaxed">
            At <span className="font-bold text-teal-600">PresCrypt</span>, we offer a comprehensive
            suite of healthcare services designed to make managing your health
            easier and more efficient. Whether you are a{" "}
            <span className="font-bold text-blue-600">Patient, Doctor, or Administrator</span>,
            we have solutions to meet your needs.
          </p>
          <p className="text-lg md:text-x text-gray-600 mt-3 leading-relaxed">
            Our platform is built with cutting-edge technology to ensure secure
            and seamless access to your medical records, appointments, and
            prescriptions. Join thousands of satisfied users who trust <span className="font-bold text-teal-600">PresCrypt </span> 
            to simplify their healthcare experience. Together, we can build a healthier future.
          </p>
        </div>

        {/* Image Section */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <div className="relative w-full aspect-[4/3] max-w-md">
          <Image
            src="/mainpageImage.png"
            alt="Doctor and Patient"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}