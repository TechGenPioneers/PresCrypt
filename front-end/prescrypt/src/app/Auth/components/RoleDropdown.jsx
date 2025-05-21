"use client";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleDropdown({ formData, setFormData }) {
  const router = useRouter();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <div className="relative mb-6">
      <button
        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-left text-sm flex justify-between items-center"
        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
      >
        {formData.role || "Choose your Role"}
        <ChevronDown size={18} className="text-gray-600" />
      </button>
      {showRoleDropdown && (
        <div className="absolute w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
          {["Patient", "Doctor", "Admin"].map((role) => (
            <div
              key={role}
              className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                setFormData({ ...formData, role });
                setShowRoleDropdown(false);
                if (role === "Patient") {
                  router.push("/Auth/PatientRegistration");
                } else if (role === "Admin") {
                  router.push("/Auth/AdminRegistration");
                }
              }}
            >
              {role}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
