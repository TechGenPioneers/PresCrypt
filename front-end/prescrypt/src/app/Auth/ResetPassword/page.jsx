'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import SubmitButton from '../components/SubmitButton';
import CardLayout from '../components/CardLayout';
import Alert from '../components/Alert';
import axios from 'axios';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required.';
    } else if (!passwordPattern.test(formData.newPassword)) {
      newErrors.newPassword = 'Must be 6+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please re-enter your password.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/user/ResetPassword', {
        Email: email,
        Token: token,
        NewPassword: formData.newPassword
      });

      setMessage(response.data.message);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to reset password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardLayout>
      <h2 className="text-2xl font-semibold text-center text-gray-800">Change Your Password</h2>
      <p className="text-sm text-gray-600 text-center mb-4">
        Enter a new password below to change your password.
      </p>

      {/* New Password Field */}
      <div className="relative mb-4">
        <input
          type={showPassword ? 'text' : 'password'}
          name="newPassword"
          placeholder="New password"
          value={formData.newPassword}
          onChange={handleChange}
          className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.newPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
      </div>

      {/* Confirm Password Field */}
      <div className="relative mb-4">
        <input
          type={showConfirm ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Re-enter new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
      </div>

      {errors.submit && <Alert type="error" message={errors.submit} />}
      {message && <Alert type="success" message={message} />}

      <SubmitButton onClick={handleSubmit} text="Reset password" loading={loading} />
    </CardLayout>
  );
}
