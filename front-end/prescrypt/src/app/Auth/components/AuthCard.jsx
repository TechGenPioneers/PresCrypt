import React from 'react';
import Image from 'next/image';
const AuthCard = ({ children, imageSrc, imageAlt }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl w-full z-10">
      <div className="flex flex-col justify-center p-8 w-full md:w-1/2">
        {children}
      </div>
      {imageSrc && (
        <div className="hidden md:flex justify-center items-center p-6 md:w-1/2">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={350}
            height={300}
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default AuthCard;