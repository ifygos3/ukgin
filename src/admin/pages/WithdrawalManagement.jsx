import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('access_token');

  const fetchWithdrawals = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await axios.get(`http://127.0.0.1:8000/users/withdrawals/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawals(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWithdrawals(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/withdrawals/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWithdrawals();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/withdrawals/${id}/reject/`, {}, {
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
      <div className="flex gap-4 mb-6">
        {['all', 'pending', 'approved', 'rejected', 'processing', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">ID</th>
              <th className="text-left p-3 text-gray-400">User</th>
              <th className="text-left p-3 text-gray-400">Amount</th>
              <th className="text-left p-3 text-gray-400">Method</th>
              <th className="text-left p-3 text-gray-400">Status</th>
              <th className="text-left p-3 text-gray-400">Date</th>
              <th className="text-left p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{w.id}</td>
                <td className="p-3">{w.user?.full_name || 'N/A'}</td>
                <td className="p-3 text-red-400 font-bold">${w.amount}</td>
                <td className="p-3 text-gray-400">{w.payment_method}</td>
                <td className="p-3">{statusBadge(w.status)}</td>
                <td className="p-3 text-gray-400 text-xs">{new Date(w.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  {w.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(w.id)} className="text-green-400 hover:text-green-300 text-xs font-bold">Approve</button>
                      <button onClick={() => handleReject(w.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalManagement;