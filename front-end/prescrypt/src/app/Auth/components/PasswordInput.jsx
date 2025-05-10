// components/auth/PasswordInput.jsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
const PasswordInput = ({ value, onChange, error, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full mb-3">
      <input
        type={showPassword ? "text" : "password"}
        className={`w-full px-4 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-teal-400 focus:outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={value}
        onChange={onChange}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 flex items-center text-gray-600"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default PasswordInput;