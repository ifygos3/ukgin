import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, isAdmin, loading, logout } = useAuth();

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-yellow-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'User Management', icon: '👥' },
    { path: '/admin/deposits', label: 'Deposits', icon: '💰' },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: '💸' },
    { path: '/admin/donations', label: 'Donations', icon: '❤️' },
    { path: '/admin/kyc', label: 'KYC Verification', icon: '🪪' },
    { path: '/admin/wallets', label: 'Wallet Management', icon: '🧾' },
    { path: '/admin/event-management', label: 'Event Management', icon: '📅' },
    { path: '/admin/announcements', label: 'Announcements', icon: '📢' },
    { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/admin/support-tickets', label: 'Support Tickets', icon: '🎫' },
    { path: '/admin/referrals', label: 'Referrals', icon: '🔗' },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: '📋' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📝' },
    { path: '/admin/settings', label: 'System Settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <Link to="/admin" className="text-yellow-400 font-bold text-lg whitespace-nowrap">
            {sidebarOpen ? 'UKGIN Admin' : 'U'}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-1">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors ${
                window.location.pathname.startsWith(item.path) ? 'bg-gray-800 text-yellow-400 border-l-2 border-yellow-400' : 'text-gray-300'
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">
            {sidebarOpen ? 'Logout' : '🚪'}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-yellow-400">UKGIN Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user?.email || 'Admin'}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
