"use client";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { TextField } from "@mui/material";

export default function PasswordForm({ formData, setFormData, errors, setErrors }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-6 relative">
        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          name="Password"
          label="Password"
          variant="outlined"
          value={formData.Password}
          onChange={handleChange}
          error={!!errors.Password}
          helperText={errors.Password}
          size="small"
          onFocus={() => setIsPasswordFieldActive(true)}
          onBlur={(e) => {
            if (document.activeElement !== e.target.form?.ConfirmPassword) {
              setTimeout(() => setIsPasswordFieldActive(false), 100);
            }
          }}
          InputProps={{
            endAdornment: (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ),
          }}
        />
      </div>
      <div className="mb-6 relative">
        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          name="ConfirmPassword"
          label="Confirm Password"
          variant="outlined"
          value={formData.ConfirmPassword}
          onChange={handleChange}
          error={!!errors.ConfirmPassword}
          helperText={errors.ConfirmPassword}
          size="small"
          onFocus={() => setIsPasswordFieldActive(true)}
          onBlur={(e) => {
            if (document.activeElement !== e.target.form?.Password) {
              setTimeout(() => setIsPasswordFieldActive(false), 100);
            }
          }}
          InputProps={{
            endAdornment: (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            ),
          }}
        />
      </div>
      {isPasswordFieldActive && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-600 mb-3">
            Password Requirements:
          </h4>
          <ul className="list-none p-0 m-0">
            <li
              className={`text-xs mb-2 pl-6 relative ${
                formData.Password.length >= 8 ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`absolute left-0 text-sm ${
                  formData.Password.length >= 8 ? "font-bold" : ""
                }`}
              >
                {formData.Password.length >= 8 ? "✓" : "○"}
              </span>
              At least 8 characters
            </li>
            <li
              className={`text-xs mb-2 pl-6 relative ${
                /[A-Z]/.test(formData.Password) ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`absolute left-0 text-sm ${
                  /[A-Z]/.test(formData.Password) ? "font-bold" : ""
                }`}
              >
                {/[A-Z]/.test(formData.Password) ? "✓" : "○"}
              </span>
              At least 1 uppercase letter
            </li>
            <li
              className={`text-xs mb-2 pl-6 relative ${
                /[a-z]/.test(formData.Password) ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`absolute left-0 text-sm ${
                  /[a-z]/.test(formData.Password) ? "font-bold" : ""
                }`}
              >
                {/[a-z]/.test(formData.Password) ? "✓" : "○"}
              </span>
              At least 1 lowercase letter
            </li>
            <li
              className={`text-xs mb-2 pl-6 relative ${
                /\d/.test(formData.Password) ? "text-green-600" : "text-gray-600"
              }`}
            >
              <span
                className={`absolute left-0 text-sm ${
                  /\d/.test(formData.Password) ? "font-bold" : ""
                }`}
              >
                {/\d/.test(formData.Password) ? "✓" : "○"}
              </span>
              At least 1 number
            </li>
            <li
              className={`text-xs mb-2 pl-6 relative ${
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.Password)
                  ? "text-green-600"
                  : "text-gray-600"
              }`}
            >
              <span
                className={`absolute left-0 text-sm ${
                  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.Password)
                    ? "font-bold"
                    : ""
                }`}
              >
                {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.Password)
                  ? "✓"
                  : "○"}
              </span>
              At least 1 special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
