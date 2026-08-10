import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);
    setResendMessage('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login/`,
        { username: email, phone_number: email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { access, refresh, user } = response.data;
      login(user, access, refresh);
      navigate('/admin');
    } catch (err) {
      if (err.response) {
        const message = err.response.data.detail || 'Login failed';
        setError(message);
        setNeedsVerification(err.response.status === 403 && message.includes('verify your email'));
      } else {
        setError('Cannot connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email first.');
      return;
    }
    setResendingVerification(true);
    setResendMessage('');
    try {
      await axios.post(
        `${API_BASE_URL}/users/email-verify/resend/`,
        { email: email.includes('@') ? email : `${email}@example.com`, frontend_url: window.location.origin },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResendMessage('Verification email sent! Please check your inbox.');
    } catch {
      setResendMessage('Could not send verification email. Please try again later.');
    } finally {
      setResendingVerification(false);
    }
  };

  const inputBase = 'w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors';
  const labelBase = 'block text-sm text-gray-400 mb-1.5 font-medium';

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-gray-900/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-400">UKGIN Admin</h1>
          <p className="text-gray-400 mt-2">Sign in to your admin panel</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 text-red-300 rounded-xl text-sm border border-red-500/20" role="alert">
            {error}
          </div>
        )}
        {needsVerification && (
          <div className="mb-4 p-3 bg-yellow-500/10 text-yellow-300 rounded-xl text-sm border border-yellow-500/20">
            <p className="mb-2">Your email is not verified. Please check your inbox for the verification link.</p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="w-full bg-yellow-400 text-gray-900 py-2 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              {resendingVerification ? 'Sending...' : 'Resend Verification Email'}
            </button>
            {resendMessage && (
              <p className="mt-2 text-sm text-green-300">{resendMessage}</p>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className={labelBase}>Email, Username, or Phone Number</label>
            <input id="admin-email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={inputBase} required />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelBase}>Password</label>
            <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputBase} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
