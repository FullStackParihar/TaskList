import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import baseurl from '../utils/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseurl}/user/verifyotp`, {
        email,
        otp,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <p className="text-red-500 text-center">No email provided. Please sign up again.</p>
          <p className="text-center mt-4">
            <Link to="/signup" className="text-blue-500 hover:underline">
              Go to Sign Up
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-4">
          An OTP has been sent to {email}
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">OTP</label>
            <input
              type="text"
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 transition"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
          <p className="text-center text-gray-600">
            Back to{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;