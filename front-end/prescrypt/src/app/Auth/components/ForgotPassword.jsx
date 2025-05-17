'use client';

import { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/SubmitButton';
import Alert from '../components/Alert';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');
  
    if (!email) {
      setError('Please enter your email.');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7021/api/User/ForgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link.');
      }
  
      const data = await response.json();
      setMessage(data.message || 'Reset link sent to your email.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-teal-700">Forgot Password</h2>
        <p className="text-sm text-gray-600 mt-1">Enter your email to reset your password.</p>
      </div>

      <InputField
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {error && <Alert type="error" message={error} />}
      {message && <Alert type="success" message={message} />}

      <Button 
        onClick={handleSubmit} 
        loading={loading}
        text="Send Reset Link"
        className="w-full mt-4"
      />
      
      <div className="mt-4 text-center">
        <a
          href="/Auth/login"
          className="text-green-800 hover:text-teal-500 text-sm font-medium"
        >
          ← Back to Login
        </a>
      </div>
    </div>
  );
}