import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const token = localStorage.getItem('access_token');

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.set('action', actionFilter);
      const res = await axios.get(`${API_BASE_URL}/users/audit-logs/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [actionFilter]);

  const actionBadge = (action) => {
    const colors = {
      login: 'bg-green-500/20 text-green-300', login_failed: 'bg-red-500/20 text-red-300', logout: 'bg-gray-500/20 text-gray-300',
      user_create: 'bg-blue-500/20 text-blue-300', user_update: 'bg-purple-500/20 text-purple-300', user_delete: 'bg-red-500/20 text-red-300',
      user_activate: 'bg-green-500/20 text-green-300', user_suspend: 'bg-orange-500/20 text-orange-300', user_ban: 'bg-red-500/20 text-red-300',
      deposit_approve: 'bg-green-500/20 text-green-300', deposit_reject: 'bg-red-500/20 text-red-300',
      withdrawal_approve: 'bg-green-500/20 text-green-300', withdrawal_reject: 'bg-red-500/20 text-red-300',
      kyc_approve: 'bg-green-500/20 text-green-300', kyc_reject: 'bg-red-500/20 text-red-300',
      wallet_credit: 'bg-green-500/20 text-green-300', wallet_debit: 'bg-red-500/20 text-red-300',
      wallet_freeze: 'bg-orange-500/20 text-orange-300', wallet_unfreeze: 'bg-green-500/20 text-green-300',
      other: 'bg-gray-500/20 text-gray-300',
    };
    return <span className={`px-2 py-1 rounded text-xs ${colors[action] || 'bg-gray-500/20 text-gray-300'}`}>{action}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Audit Logs</h1>
      <div className="mb-6">
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="bg-black p-3 rounded-xl border border-gray-700 text-white">
          <option value="">All Actions</option>
          <option value="login">Login</option>
          <option value="login_failed">Login Failed</option>
          <option value="user_create">User Created</option>
          <option value="user_update">User Updated</option>
          <option value="user_delete">User Deleted</option>
          <option value="user_activate">User Activated</option>
          <option value="user_suspend">User Suspended</option>
          <option value="user_ban">User Banned</option>
          <option value="deposit_approve">Deposit Approved</option>
          <option value="deposit_reject">Deposit Rejected</option>
          <option value="withdrawal_approve">Withdrawal Approved</option>
          <option value="withdrawal_reject">Withdrawal Rejected</option>
          <option value="kyc_approve">KYC Approved</option>
          <option value="kyc_reject">KYC Rejected</option>
          <option value="wallet_credit">Wallet Credited</option>
          <option value="wallet_debit">Wallet Debited</option>
          <option value="wallet_freeze">Wallet Frozen</option>
          <option value="wallet_unfreeze">Wallet Unfrozen</option>
        </select>
      </div>
      <div className="w-full overflow-x-auto overscroll-x-contain" style={{WebkitOverflowScrolling: 'touch', touchAction: 'pan-x'}}>
        <div className="min-w-[720px] w-full">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{tableLayout: 'fixed'}}>
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Admin</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Action</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Target User</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Details</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">IP</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{log.admin_user?.full_name || 'System'}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{actionBadge(log.action)}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{log.target_user?.full_name || 'N/A'}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm max-w-xs truncate">{log.details}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{log.ip_address}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;