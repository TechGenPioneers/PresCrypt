// components/registration/ProfessionalInfoForm.jsx
"use client";
import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Eye, EyeOff, ChevronDown, Search, Plus, Trash2 } from "lucide-react";

export default function ProfessionalInfoForm({
  formData,
  setFormData,
  onPrev,
  onSuccess,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFieldActive, setIsPasswordFieldActive] = useState(false);
  const [errors, setErrors] = useState({});

  // Add other state and handler functions from original component

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Hospital Schedules */}
        <div className="space-y-4">
          {/* Hospital schedule form components */}
        </div>

        {/* Right Column - Password */}
        <div className="space-y-4">
          <TextField
            label="Password"
            name="Password"
            type={showPassword ? "text" : "password"}
            value={formData.Password}
            onChange={handleChange}
            fullWidth
            error={!!errors.Password}
            helperText={errors.Password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => setIsPasswordFieldActive(true)}
          />

          <TextField
            label="Confirm Password"
            name="ConfirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.ConfirmPassword}
            onChange={handleChange}
            fullWidth
            error={!!errors.ConfirmPassword}
            helperText={errors.ConfirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => setIsPasswordFieldActive(true)}
            onBlur={() => setIsPasswordFieldActive(false)}
          />

          {isPasswordFieldActive && (
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Password Requirements:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  <span
                    className={`inline-block w-4 h-4 mr-2 ${
                      formData.Password.length >= 8
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    {formData.Password.length >= 8 ? "✓" : "○"}
                  </span>
                  At least 8 characters
                </li>
                {/* Other password requirements */}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-teal-100 text-green-800 rounded-md font-medium hover:bg-teal-200"
        >
          Request Verification
        </button>
      </div>
    </form>
  );
}