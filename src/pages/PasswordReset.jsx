import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/password-reset/confirm/`,
        { email, token, new_password: newPassword, confirm_password: confirmPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMessage({ type: 'success', text: 'Password has been reset successfully!' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.response) {
        setMessage({ type: 'error', text: err.response.data.detail || 'Reset failed' });
      } else {
        setMessage({ type: 'error', text: 'Cannot connect to server' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors';
  const labelBase = 'block text-sm text-gray-400 mb-1.5 font-medium';

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-md mx-auto bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">Reset Password</h1>
          <p className="text-gray-400 mt-2">Enter your details to reset your password</p>
        </div>
        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/15 text-green-300 border border-green-500/20' : 'bg-red-500/15 text-red-300 border border-red-500/20'}`} role="alert">
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className={labelBase}>Email</label>
            <input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBase} required />
          </div>
          <div>
            <label htmlFor="reset-token" className={labelBase}>Reset Token</label>
            <input id="reset-token" type="text" value={token} onChange={(e) => setToken(e.target.value)} className={inputBase} required />
          </div>
          <div>
            <label htmlFor="reset-new-password" className={labelBase}>New Password</label>
            <input id="reset-new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputBase} required minLength="8" />
          </div>
          <div>
            <label htmlFor="reset-confirm" className={labelBase}>Confirm Password</label>
            <input id="reset-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputBase} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
