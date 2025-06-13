
import Image from "next/image";

export default function LogoSection() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="mb-6">
        <Image
          src="/logo.png"
          alt="PresCrypt Logo"
          width={150}
          height={50}
          className="h-auto"
        />
      </div>
      <h2 className="text-2xl font-bold text-green-800 text-center">
        JOIN US FOR A HEALTHIER TOMORROW!
      </h2>
      <p className="text-gray-600 text-center">Create your account</p>
    </div>
  );
}
