import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReferralManagement = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('access_token');

  const fetchReferrals = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/users/referrals/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReferrals(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Referral Management</h1>
      {loading ? <div className="text-gray-400">Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-3 text-gray-400">Referrer</th>
                <th className="text-left p-3 text-gray-400">Referred User</th>
                <th className="text-left p-3 text-gray-400">Reward</th>
                <th className="text-left p-3 text-gray-400">Status</th>
                <th className="text-left p-3 text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-3">{ref.referrer?.full_name}</td>
                  <td className="p-3">{ref.referred_user?.full_name}</td>
                  <td className="p-3 text-yellow-400">${ref.reward_amount}</td>
                  <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${ref.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{ref.status}</span></td>
                  <td className="p-3 text-gray-400 text-xs">{new Date(ref.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;