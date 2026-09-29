import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const LoginHistory = () => {
  const [logins, setLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const token = localStorage.getItem('access_token');

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogins();
    const interval = setInterval(fetchLogins, 30000);
    return () => clearInterval(interval);
  }, [fetchLogins]);

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Recent Logins</h1>
        <span className="text-gray-400">{totalCount} total logins</span>
      </div>

      <div className="w-full -mx-3 sm:mx-0 overflow-x-auto overscroll-x-contain overscroll-y-contain" style={{WebkitOverflowScrolling: 'touch'}}>
        <div className="min-w-[720px] w-full">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{tableLayout: 'fixed'}}>
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">User</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">IP Address</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">User Agent</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Login Time</th>
              </tr>
            </thead>
            <tbody>
              {logins.map((login) => (
                <tr key={login.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{login.id}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{login.user?.full_name || login.user?.username || 'Unknown'}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap font-mono">{login.ip_address || '-'}</td>
                  <td className="p-2 sm:p-3 text-gray-500 text-xs sm:text-sm max-w-xs truncate">{login.device_info || '-'}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{login.created_at ? new Date(login.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {logins.length === 0 && (
        <p className="text-gray-400 text-center py-8">No login history found.</p>
      )}
    </div>
  );
};

export default LoginHistory;
