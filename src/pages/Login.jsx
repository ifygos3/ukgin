import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Login = ({ showNotification }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  const isEmailVerificationError = (err) => {
    if (!err?.response) return false;
    const detail = err.response.data?.detail || '';
    return err.response.status === 403 && detail.includes('verify your email');
  };

  const handleResendVerification = async () => {
    if (!identifier) {
      setError('Please enter your email or username first.');
      return;
    }
    setResendingVerification(true);
    setResendMessage('');
    try {
      const emailToUse = identifier.includes('@') ? identifier : undefined;
      await axios.post(
        `${API_BASE_URL}/users/email-verify/resend/`,
        { identifier: !emailToUse ? identifier : undefined, email: emailToUse, frontend_url: window.location.origin },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setResendMessage('Verification email sent! Please check your inbox.');
      showNotification?.('Verification email sent! Please check your inbox.', 'success');
    } catch {
      setResendMessage('Could not send verification email. Please try again later.');
      showNotification?.('Could not send verification email.', 'error');
    } finally {
      setResendingVerification(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login/`,
        { username: identifier, phone_number: identifier, password, remember_me: rememberMe },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { access, refresh, user } = response.data;
      const isAdminUser = user.role === 'admin' || user.role === 'super_admin' || user.is_staff;

      if (loginType === 'admin' && !isAdminUser) {
        setError('You do not have admin privileges. Please login as a user.');
        showNotification?.('You do not have admin privileges. Please login as a user.', 'error');
        return;
      }

      login(user, access, refresh);
      showNotification?.(loginType === 'admin' ? 'Admin login successful.' : 'Login successful. Welcome back!', 'success');

      if (loginType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }     catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        const message = err.response.data.detail || 'Login failed';
        setError(message);
        setNeedsVerification(isEmailVerificationError(err));
        showNotification?.(message, 'error');
      } else if (err.request) {
        const message = `Cannot connect to server at ${API_BASE_URL}. Is the backend running?`;
        setError(message);
        setNeedsVerification(false);
        showNotification?.(message, 'error');
      } else {
        const message = `Request error: ${err.message}`;
        setError(message);
        setNeedsVerification(false);
        showNotification?.(message, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/password-reset/`,
        { email: resetEmail, frontend_url: window.location.origin },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const detail = response.data?.detail || 'If that email exists, a password reset link has been sent.';
      setResetMessage(detail);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Password reset request failed. Please try again.';
      setResetMessage(detail);
    }
  };

  return (
    <div className='min-h-screen bg-[#050816] flex items-center justify-center px-4 py-12 md:px-6'>
      <div className='w-full max-w-xl mx-auto bg-gray-900/90 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-800'>
        {showPasswordReset ? (
          <div className='space-y-6'>
            <h1 className='text-3xl font-bold text-yellow-400 text-center'>Reset Password</h1>
            {resetMessage && (
              <div className="mb-4 p-4 bg-green-500/15 text-green-300 rounded-xl text-sm border border-green-500/20">
                {resetMessage}
              </div>
            )}
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-sm text-gray-400 mb-2 font-medium">Email Address</label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-yellow-400 text-gray-900 p-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors">Send Reset Link</button>
              <button type="button" onClick={() => setShowPasswordReset(false)} className="w-full text-gray-400 hover:text-white text-sm text-center mt-2 transition-colors">Back to Login</button>
            </form>
          </div>
        ) : (
          <>
            <h1 className='text-3xl font-bold text-yellow-400 text-center mb-6'>Welcome Back</h1>
            {error && (
              <div className="mb-5 p-4 bg-red-500/15 text-red-300 rounded-xl text-sm border border-red-500/20" role="alert">
                {error}
              </div>
            )}
            {needsVerification && (
              <div className="mb-5 p-4 bg-yellow-500/10 text-yellow-300 rounded-xl text-sm border border-yellow-500/20">
                <p className="mb-3">Your email is not verified yet. Please check your inbox for the verification link.</p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendingVerification}
                  className="w-full bg-yellow-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {resendingVerification ? 'Sending...' : 'Resend Verification Email'}
                </button>
                {resendMessage && (
                  <p className="mt-3 text-sm text-green-300">{resendMessage}</p>
                )}
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2 font-medium">Login As</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLoginType('user')}
                  className={`w-full py-3.5 rounded-2xl font-bold transition-colors border ${
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
                  className={`w-full py-3.5 rounded-2xl font-bold transition-colors border ${
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
                <label htmlFor="login-identifier" className="block text-sm text-gray-400 mb-2 font-medium">Email, Username, or Phone Number</label>
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
                  required
                  autoComplete="username"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-sm text-gray-400 mb-2 font-medium">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors pr-12"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-400"
                  />
                  <span className="text-sm text-gray-400">Remember Me</span>
                </label>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setShowPasswordReset(true)} className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
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
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
