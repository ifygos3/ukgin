import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Skeleton, StatCardSkeleton, CardSkeleton } from '../../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [dailyRegs, setDailyRegs] = useState([]);
  const [monthlyRegs, setMonthlyRegs] = useState([]);
  const [donationData, setDonationData] = useState([]);
  const [profitData, setProfitData] = useState(null);
  const [userActivity, setUserActivity] = useState([]);
  const [rsvpResponses, setRsvpResponses] = useState([]);
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
      const [statsRes, dailyRes, monthlyRes, donationRes, profitRes, activityRes, rsvpRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users/dashboard/stats/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/daily-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/monthly-registrations/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/donation-analytics/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/profit-analytics/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/dashboard/user-activity/`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/users/admin/event-responses/?limit=10`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setDailyRegs(dailyRes.data);
      setMonthlyRegs(monthlyRes.data);
      setDonationData(donationRes.data);
      setProfitData(profitRes.data);
      setUserActivity(activityRes.data);
      setRsvpResponses(rsvpRes?.data?.results || rsvpRes?.data || []);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-24 h-9" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} lines={4} />
          ))}
        </div>
      </div>
    );
  }

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

  const StatCard = ({ label, value, link, color = 'text-blue-400' }) => (
    <div onClick={() => navigate(link)} className="bg-gray-900 aspect-square p-3 sm:p-4 rounded-xl border border-gray-800 transition-all duration-300 hover:scale-[1.03] hover:border-yellow-400 hover:bg-gray-800 flex flex-col items-center justify-center text-center">
      <p className="text-gray-300 text-sm sm:text-base font-bold mb-1 sm:mb-2 truncate">{label}</p>
      <p className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 hidden sm:block font-semibold">View details →</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">Dashboard Overview</h1>
        <button onClick={() => window.location.reload()} className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-700 transition-colors">Refresh</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Total Members" value={stats.total_users} link={statLinks.total_users} color="text-blue-400" />
        <StatCard label="Active Members" value={stats.active_users} link={statLinks.active_users} color="text-green-400" />
        <StatCard label="Pending Members" value={stats.pending_members || 0} link={statLinks.pending_members} color="text-orange-400" />
        <StatCard label="KYC Pending" value={stats.pending_kyc} link={statLinks.pending_kyc} color="text-orange-400" />
        <StatCard label="Total Donations" value={`$${stats.total_donations}`} link={statLinks.total_donations} color="text-yellow-400" />
        <StatCard label="Revenue" value={`$${stats.monthly_revenue}`} link={statLinks.monthly_revenue} color="text-yellow-400" />
        <StatCard label="Total Deposits" value={`$${stats.total_deposits}`} link={statLinks.total_deposits} color="text-blue-400" />
        <StatCard label="Pending Deposits" value={`$${stats.pending_deposits}`} link={statLinks.pending_deposits} color="text-orange-400" />
        <StatCard label="Approved Deposits" value={`$${stats.approved_deposits}`} link={statLinks.approved_deposits} color="text-green-400" />
        <StatCard label="Events" value={stats.total_events || 0} link={statLinks.total_events} color="text-blue-400" />
        <StatCard label="News Posts" value={stats.total_news || 0} link={statLinks.total_news} color="text-purple-400" />
        <StatCard label="Projects" value={stats.total_projects || 0} link={statLinks.total_projects} color="text-green-400" />
        <StatCard label="Gallery Items" value={stats.total_gallery || 0} link={statLinks.total_gallery} color="text-blue-400" />
        <StatCard label="Downloads" value={stats.total_downloads || 0} link={statLinks.total_downloads} color="text-green-400" />
        <StatCard label="Volunteers" value={stats.total_volunteers || 0} link={statLinks.total_volunteers} color="text-yellow-400" />
        <StatCard label="Partners" value={stats.total_partners || 0} link={statLinks.total_partners} color="text-blue-400" />
        <StatCard label="Sponsors" value={stats.total_sponsors || 0} link={statLinks.total_sponsors} color="text-yellow-400" />
        <StatCard label="State Chapters" value={stats.total_states || 0} link={statLinks.total_states} color="text-purple-400" />
        <StatCard label="LGA Chapters" value={stats.total_lgas || 0} link={statLinks.total_lgas} color="text-blue-400" />
        <StatCard label="Notifications" value={stats.total_notifications || 0} link={statLinks.total_notifications} color="text-orange-400" />
        <StatCard label="Reports" value={stats.total_reports || 0} link={statLinks.total_reports} color="text-green-400" />
        <StatCard label="Recent Logins" value={stats.recent_logins || 0} link={statLinks.recent_logins} color="text-blue-400" />
        <StatCard label="Platform Balance" value={`$${stats.total_platform_balance}`} link={statLinks.total_platform_balance} color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">Daily User Registrations</h3>
          <div className="space-y-2">
            {dailyRegs.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center gap-3">
                <span className="text-gray-300 text-sm font-semibold shrink-0">{item.date}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-yellow-400 rounded-full h-3 shrink-0 transition-all" style={{ width: `${Math.min(item.count * 10, 200)}px` }}></div>
                  <span className="text-sm font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">Monthly Registrations</h3>
          <div className="space-y-2">
            {monthlyRegs.slice(-6).map((item, i) => (
              <div key={i} className="flex justify-between items-center gap-3">
                <span className="text-gray-300 text-sm font-semibold shrink-0">{item.year}-{String(item.month).padStart(2, '0')}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="bg-blue-400 rounded-full h-3 shrink-0 transition-all" style={{ width: `${Math.min(item.count * 10, 200)}px` }}></div>
                  <span className="text-sm font-bold">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">Donation Analytics</h3>
          <div className="space-y-2">
            {donationData.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center gap-3">
                <span className="text-gray-300 text-sm font-semibold shrink-0">{item.date}</span>
                <div className="text-right">
                  <span className="text-green-400 font-extrabold text-sm">${item.total}</span>
                  <span className="text-gray-500 text-xs ml-2 hidden sm:inline font-semibold">({item.count} donations)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">Profit Analytics</h3>
          {profitData && (
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-300 text-sm font-semibold">Total Deposits</span><span className="text-blue-400 font-extrabold text-sm">${profitData.total_deposits}</span></div>
              <div className="flex justify-between"><span className="text-gray-300 text-sm font-semibold">Total Withdrawals</span><span className="text-red-400 font-extrabold text-sm">${profitData.total_withdrawals}</span></div>
              <div className="flex justify-between"><span className="text-gray-300 text-sm font-semibold">Total Donations</span><span className="text-green-400 font-extrabold text-sm">${profitData.total_donations}</span></div>
              <div className="border-t border-gray-700 pt-2 flex justify-between"><span className="text-gray-200 font-bold text-sm">Profit</span><span className="text-yellow-400 font-extrabold text-base">${profitData.profit}</span></div>
            </div>
          )}
        </div>
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">User Activity (Logins)</h3>
          <div className="space-y-2">
            {userActivity.slice(-10).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm font-semibold">{item.date}</span>
                <span className="text-sm font-bold">{item.count} logins</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800">
          <h3 className="text-lg sm:text-xl font-extrabold text-yellow-400 mb-3">Recent Event Responses</h3>
          {rsvpResponses.length === 0 ? (
            <p className="text-gray-400 text-sm font-semibold">No recent responses.</p>
          ) : (
            <div className="space-y-2">
              {rsvpResponses.slice(0, 8).map((r) => (
                <div key={r.id} className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{r.user?.email || r.user?.full_name || 'Anonymous'}</p>
                    <p className="text-gray-400 text-sm truncate font-semibold">{r.event?.name || `Event #${r.event}`}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm">{r.response_type === 'going' ? '👍' : r.response_type === 'interested' ? '⭐' : '❌'}</div>
                    <div className="text-gray-400 text-xs font-semibold">{r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
