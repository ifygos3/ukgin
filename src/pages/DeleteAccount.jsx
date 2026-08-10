import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const DeleteAccount = () => {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      showNotification('Please type DELETE to confirm.', 'error');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/users/delete-account/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      showNotification('Your account has been deleted.', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete account. Please try again.', 'error');
    }
    finally { setLoading(false); }
  };

  return (
    <div className='min-h-screen pt-24 pb-12 px-4 sm:px-6'>
      <div className='max-w-md mx-auto'>
        <div className='bg-gray-900/80 backdrop-blur-sm p-8 rounded-3xl border border-red-500/30 shadow-xl'>
          <h1 className='text-3xl font-bold text-red-400 text-center mb-4'>Delete Account</h1>
          <p className='text-gray-300 text-center mb-6'>
            This action is <span className='text-red-400 font-bold'>permanent</span> and cannot be undone. All your data will be permanently removed.
          </p>
          <div className='mb-6'>
            <label className='block text-sm text-gray-400 mb-2'>Type <span className='text-red-400 font-bold'>DELETE</span> to confirm:</label>
            <input
              type='text'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-red-400 focus:outline-none transition-colors'
              placeholder='DELETE'
            />
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={handleDelete}
              disabled={loading || confirmText !== 'DELETE'}
              className={`flex-1 bg-red-600 text-white p-4 rounded-xl font-bold transition-colors ${loading || confirmText !== 'DELETE' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500'}`}
            >
              {loading ? 'Deleting...' : 'Permanently Delete Account'}
            </button>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='flex-1 bg-gray-700 text-white p-4 rounded-xl font-bold transition-colors hover:bg-gray-600'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
