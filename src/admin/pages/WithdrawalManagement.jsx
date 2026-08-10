import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('access_token');

  const fetchWithdrawals = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await axios.get(`${API_BASE_URL}/users/withdrawals/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawals(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWithdrawals(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/withdrawals/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWithdrawals();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/withdrawals/${id}/reject/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWithdrawals();
    } catch (err) { console.error(err); }
  };

  const statusBadge = (status) => {
    const colors = { pending: 'bg-yellow-500/20 text-yellow-300', approved: 'bg-green-500/20 text-green-300', rejected: 'bg-red-500/20 text-red-300', processing: 'bg-blue-500/20 text-blue-300', completed: 'bg-purple-500/20 text-purple-300' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[status] || 'bg-gray-500/20 text-gray-300'}`}>{status}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Withdrawal Management</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved', 'rejected', 'processing', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${filter === f ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-[640px] sm:min-w-0 align-middle">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">User</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Amount</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Method</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Date</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{w.id}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{w.user?.full_name || 'N/A'}</td>
                  <td className="p-2 sm:p-3 text-red-400 font-bold text-xs sm:text-sm whitespace-nowrap">${w.amount}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{w.payment_method}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{statusBadge(w.status)}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    {w.status === 'pending' && (
                      <div className="flex gap-1.5 sm:gap-2">
                        <button onClick={() => handleApprove(w.id)} className="text-green-400 hover:text-green-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-green-500/10 transition-colors">Approve</button>
                        <button onClick={() => handleReject(w.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalManagement;