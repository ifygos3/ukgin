import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login/`,
        { username: email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { access, refresh, user } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      if (loginType === 'admin') {
        if (user.role === 'admin' || user.role === 'super_admin' || user.is_staff) {
          navigate('/admin');
        } else {
          setError('You do not have admin privileges. Please login as a user.');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Login failed');
      } else {
        setError('Cannot connect to server');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    try {
      await axios.post(
        `${API_BASE_URL}/users/password-reset/`,
        { email: resetEmail, frontend_url: window.location.origin },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResetMessage('If that email exists, a password reset link has been sent.');
    } catch {
      setResetMessage('If that email exists, a password reset link has been sent.');
    }
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <div className='max-w-md mx-auto bg-gray-900 p-10 rounded-3xl'>
        {showPasswordReset ? (
          <div>
            <h1 className='text-3xl font-bold text-yellow-400 text-center mb-6'>Reset Password</h1>
            {resetMessage && (
              <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-xl text-sm">
                {resetMessage}
              </div>
            )}
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white"
                required
              />
              <button type="submit" className="w-full bg-yellow-400 text-gray-900 p-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
                Send Reset Link
              </button>
              <button type="button" onClick={() => setShowPasswordReset(false)} className="w-full text-gray-400 hover:text-white text-sm text-center mt-2">
                Back to Login
              </button>
            </form>
          </div>
        ) : (
          <>
            <h1 className='text-3xl font-bold text-yellow-400 text-center mb-6'>Welcome Back</h1>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-xl text-sm">
                {error}
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Login As</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setLoginType('user')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors border ${
                    loginType === 'user'
                      ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                      : 'bg-transparent text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 py-3 rounded-xl font-bold transition-colors border ${
                    loginType === 'admin'
                      ? 'bg-yellow-400 text-gray-900 border-yellow-400'
                      : 'bg-transparent text-gray-300 border-gray-700 hover:border-gray-500'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email or Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
<div>
                 <label className="block text-sm text-gray-400 mb-1">Password</label>
                 <div className="relative">
                   <input
                     type={showPassword ? 'text' : 'password'}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none pr-10"
                     required
                   />
                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                     {showPassword ? '🙈' : '👁'}
                   </button>
                 </div>
               </div>
              <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setShowPasswordReset(true)} className="text-yellow-400 hover:text-yellow-300 text-sm">
                  Forgot Password?
                </button>
              </div>
              <div className="text-center text-gray-400 text-sm mt-4">
                Don't have an account? <Link to="/signup" className="text-yellow-400 hover:underline">Sign Up</Link>
              </div>
            </form>
          </>
        )}
        <div className="mt-6 text-center">
          <Link to="/" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
