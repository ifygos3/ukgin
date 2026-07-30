import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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
        'http://127.0.0.1:8000/users/password-reset/confirm/',
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

  return (
    <div className='pt-32 px-6 md:px-20'>
      <div className='max-w-md mx-auto bg-gray-900 p-10 rounded-3xl'>
        <h1 className='text-3xl font-bold text-yellow-400 text-center mb-6'>Reset Password</h1>
        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white" required />
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Reset Token" className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white" required />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white" required minLength="8" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white" required />
          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-400 hover:text-yellow-400 text-sm">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;