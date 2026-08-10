import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const LoginHistory = () => {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchLogins = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/login-history/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.results || res.data || [];
      setLogins(data);
      setTotalCount(res.data.count || data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLogins(); }, [fetchLogins]);

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Recent Logins</h1>
        <span className="text-gray-400">{totalCount} total logins</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">ID</th>
              <th className="text-left p-3 text-gray-400">User</th>
              <th className="text-left p-3 text-gray-400">IP Address</th>
              <th className="text-left p-3 text-gray-400">User Agent</th>
              <th className="text-left p-3 text-gray-400">Login Time</th>
            </tr>
          </thead>
          <tbody>
            {logins.map((login) => (
              <tr key={login.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{login.id}</td>
                <td className="p-3 text-white font-bold">{login.user?.full_name || login.user?.username || 'Unknown'}</td>
                <td className="p-3 text-gray-400 font-mono text-xs">{login.ip_address || '-'}</td>
                <td className="p-3 text-gray-500 text-xs max-w-xs truncate">{login.device_info || '-'}</td>
                <td className="p-3 text-gray-400 text-xs">{login.created_at ? new Date(login.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logins.length === 0 && (
        <p className="text-gray-400 text-center py-8">No login history found.</p>
      )}
    </div>
  );
};

export default LoginHistory;
