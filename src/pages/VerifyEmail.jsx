import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link. Please request a new one.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/email-verify/`, {
          params: { token, email },
        });
        setStatus('success');
        setMessage(res.data.detail || 'Email verified successfully!');
        showNotification?.('Email verified successfully. You can now login.', 'success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        setStatus('error');
        const data = err?.response?.data;
        setMessage(data?.detail || 'Verification failed. The link may be invalid or expired.');
        showNotification?.('Email verification failed.', 'error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate, showNotification]);

  return (
    <div className='min-h-screen pt-24 pb-12 px-4 sm:px-6'>
      <div className='max-w-md mx-auto text-center'>
        <div className='bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-xl'>
          <div className='text-6xl mb-4'>
            {status === 'verifying' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          <h1 className='text-2xl font-bold text-yellow-400 mb-4'>Email Verification</h1>
          <p className={`text-lg mb-6 ${status === 'success' ? 'text-green-300' : status === 'error' ? 'text-red-300' : 'text-gray-300'}`}>
            {message}
          </p>
          {status === 'success' && (
            <p className='text-sm text-gray-400'>Redirecting to login...</p>
          )}
          {status === 'error' && (
            <button onClick={() => navigate('/login')} className='mt-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition'>
              Go to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
