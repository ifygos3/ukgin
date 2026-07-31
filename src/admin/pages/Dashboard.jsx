import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [dailyRegs, setDailyRegs] = useState([]);
  const [monthlyRegs, setMonthlyRegs] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [profitData, setProfitData] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('Please log in again to view the dashboard.');
      setLoading(false);
      return;
    }

    try {
      const [statsRes, dailyRes, monthlyRes, donationRes, profitRes, activityRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users/dashboard/stats/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/daily-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/monthly-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/donation-analytics/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/profit-analytics/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/user-activity/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setDailyRegs(dailyRes.data);
      setMonthlyRegs(monthlyRes.data);
      setDonationData(donationRes.data);
      setProfitData(profitRes.data);
      setUserActivity(activityRes.data);
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || 'Failed to load dashboard data';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;
  if (!stats) return null;

  const statLinks = {
    total_users: '/admin/users',
    active_users: '/admin/users',
    pending_members: '/admin/users',
    pending_kyc: '/admin/kyc',
    total_donations: '/admin/donations',
    monthly_revenue: '/admin/donations',
    total_deposits: '/admin/deposits',
    pending_deposits: '/admin/deposits',
    approved_deposits: '/admin/deposits',
    total_events: '/admin/events',
    total_news: '/admin/documents',
    total_projects: '/admin/documents',
    total_gallery: '/admin/gallery',
    total_downloads: '/admin/documents',
    total_volunteers: '/admin/volunteers',
    total_partners: '/admin/partners',
    total_sponsors: '/admin/sponsors',
    total_states: '/admin/state-chapters',
    total_lgas: '/admin/state-chapters',
    total_notifications: '/admin/notifications',
    total_reports: '/admin/reports',
    recent_logins: '/admin/audit-logs',
    total_platform_balance: '/admin/wallets',
  };

  const StatCard = ({ title, value, color = 'yellow', link = null }) => (
    <div
      onClick={() => link && navigate(link)}
      className={`bg-gray-900 p-6 rounded-xl border border-gray-800 transition-colors cursor-pointer ${link ? 'hover:border-yellow-400 hover:bg-gray-800' : ''}`}
    >
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
      {link && <p className="text-gray-500 text-xs mt-2">Click to view details →</p>}
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Members" value={stats.total_users} color="blue" link={statLinks.total_users} />
        <StatCard title="Active Members" value={stats.active_users} color="green" link={statLinks.active_users} />
        <StatCard title="Pending Members" value={stats.pending_members || 0} color="orange" link={statLinks.pending_members} />
        <StatCard title="KYC Pending" value={stats.pending_kyc} color="orange" link={statLinks.pending_kyc} />
        <StatCard title="Total Donations" value={`$${stats.total_donations}`} color="yellow" link={statLinks.total_donations} />
        <StatCard title="Revenue" value={`$${stats.monthly_revenue}`} color="yellow" link={statLinks.monthly_revenue} />
        <StatCard title="Total Deposits" value={`$${stats.total_deposits}`} color="blue" link={statLinks.total_deposits} />
        <StatCard title="Pending Deposits" value={`$${stats.pending_deposits}`} color="orange" link={statLinks.pending_deposits} />
        <StatCard title="Approved Deposits" value={`$${stats.approved_deposits}`} color="green" link={statLinks.approved_deposits} />
        <StatCard title="Events" value={stats.total_events || 0} color="blue" link={statLinks.total_events} />
        <StatCard title="News Posts" value={stats.total_news || 0} color="purple" link={statLinks.total_news} />
        <StatCard title="Projects" value={stats.total_projects || 0} color="green" link={statLinks.total_projects} />
        <StatCard title="Gallery Items" value={stats.total_gallery || 0} color="blue" link={statLinks.total_gallery} />
        <StatCard title="Downloads" value={stats.total_downloads || 0} color="green" link={statLinks.total_downloads} />
        <StatCard title="Volunteers" value={stats.total_volunteers || 0} color="yellow" link={statLinks.total_volunteers} />
        <StatCard title="Partners" value={stats.total_partners || 0} color="blue" link={statLinks.total_partners} />
        <StatCard title="Sponsors" value={stats.total_sponsors || 0} color="yellow" link={statLinks.total_sponsors} />
        <StatCard title="State Chapters" value={stats.total_states || 0} color="purple" link={statLinks.total_states} />
        <StatCard title="LGA Chapters" value={stats.total_lgas || 0} color="blue" link={statLinks.total_lgas} />
        <StatCard title="Notifications" value={stats.total_notifications || 0} color="orange" link={statLinks.total_notifications} />
        <StatCard title="Reports" value={stats.total_reports || 0} color="green" link={statLinks.total_reports} />
        <StatCard title="Recent Logins" value={stats.recent_logins || 0} color="blue" link={statLinks.recent_logins} />
        <StatCard title="Platform Balance" value={`$${stats.total_platform_balance}`} color="yellow" link={statLinks.total_platform_balance} />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Daily User Registrations</h3>
          <div className="space-y-2">
            {dailyRegs.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{item.date}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-yellow-400 rounded-full h-4" style={{ width: `${Math.min(item.count * 10, 200)}px` }}></div>
                  <span className="text-sm">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Monthly Registrations</h3>
          <div className="space-y-2">
            {monthlyRegs.slice(-6).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{item.year}-{String(item.month).padStart(2, '0')}</span>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-400 rounded-full h-4" style={{ width: `${Math.min(item.count * 10, 200)}px` }}></div>
                  <span className="text-sm">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Donation Analytics</h3>
          <div className="space-y-2">
            {donationData.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{item.date}</span>
                <span className="text-green-400 font-bold">${item.total}</span>
                <span className="text-gray-500 text-sm">({item.count} donations)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">Profit Analytics</h3>
          {profitData && (
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Total Deposits</span><span className="text-blue-400 font-bold">${profitData.total_deposits}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Total Withdrawals</span><span className="text-red-400 font-bold">${profitData.total_withdrawals}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Total Donations</span><span className="text-green-400 font-bold">${profitData.total_donations}</span></div>
              <div className="border-t border-gray-700 pt-2 flex justify-between"><span className="text-gray-300 font-bold">Profit</span><span className="text-yellow-400 font-bold text-xl">${profitData.profit}</span></div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-yellow-400 mb-4">User Activity (Logins)</h3>
          <div className="space-y-2">
            {userActivity.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">{item.date}</span>
                <span className="text-sm">{item.count} logins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;