import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlobalSearch from './GlobalSearch';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Navbar = ({ showNotification }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem('access_token');
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const pollRef = useRef(null);
  const prevUnreadRef = useRef(0);
  const notifRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (isAuthenticated && sidebarOpen && window.innerWidth >= 1280) {
      document.body.style.paddingLeft = '16rem';
    } else {
      document.body.style.paddingLeft = '0';
    }
    return () => { document.body.style.paddingLeft = '0'; };
  }, [isAuthenticated, sidebarOpen]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/users/my/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.results || res.data || [];
      setNotifications(data);
      const unread = data.filter(n => !n.is_read);
      setUnreadCount(unread.length);
      const unreadAnnouncements = unread.filter(n => n.notification_type === 'announcement');
      setAnnouncementCount(unreadAnnouncements.length);
      if (unread.length > prevUnreadRef.current) {
        setHasNewNotifications(true);
        setTimeout(() => setHasNewNotifications(false), 3000);
      }
      prevUnreadRef.current = unread.length;
    } catch {
      setNotifications([]);
      setUnreadCount(0);
      setAnnouncementCount(0);
    }
  }, [token]);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/users/my/notifications/unread-count/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = res.data.unread_count || 0;
      setUnreadCount(count);
      if (count > prevUnreadRef.current) {
        setHasNewNotifications(true);
        setTimeout(() => setHasNewNotifications(false), 3000);
      }
      prevUnreadRef.current = count;
    } catch {
      setUnreadCount(0);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      pollRef.current = setInterval(fetchNotifications, 60000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isAuthenticated, fetchNotifications]);

  useEffect(() => {
    if (!isAuthenticated) {
      prevUnreadRef.current = 0;
      setHasNewNotifications(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setNotifOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleNotificationClick = async (notif) => {
    setNotifOpen(false);
    try {
      await axios.post(`${API_BASE_URL}/users/my/notifications/${notif.id}/mark-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (notif.notification_type === 'announcement') {
        setAnnouncementCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
    } catch {
      // ignore mark-read errors
    }
    if (notif.announcement && notif.announcement.id) {
      navigate(`/announcements/${notif.announcement.id}`);
    } else if (notif.announcement_id) {
      navigate(`/announcements/${notif.announcement_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/my/notifications/mark-all-read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(0);
      setAnnouncementCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  const handleNavClick = (e, path) => {
    if (path.startsWith('#')) {
      e.preventDefault();
      const id = path.slice(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/mission-vision', label: 'Mission & Vision' },
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/news', label: 'News' },
    { to: '/projects', label: 'Projects' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/volunteer', label: 'Volunteer' },
  ];

  const memberLinks = [
    { to: '/state-chapters', label: 'Chapters' },
    { to: '/executive-leadership', label: 'Leadership' },
    { to: '/constitution', label: 'Constitution' },
    { to: '/partners', label: 'Partners' },
    { to: '/sponsors', label: 'Sponsors' },
  ];

  return (
    <>
      {isAuthenticated ? (
        <>
          {/* Desktop Sidebar */}
          <aside
            ref={sidebarRef}
            className={`fixed inset-y-0 left-0 z-40 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 transform transition-all duration-300 hidden xl:flex flex-col ${
              sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
            }`}
          >
            <div className='h-20 px-6 flex items-center justify-between border-b border-gray-800 shrink-0'>
              <Link to='/' className='text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight'>UKGIN</Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors'
                title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                  {sidebarOpen ? (
                    <path strokeLinecap='round' strokeLinejoin='round' d='M11 19l-7-7 7-7m8 14l-7-7 7-7' />
                  ) : (
                    <path strokeLinecap='round' strokeLinejoin='round' d='M13 5l7 7-7 7M5 5l7 7-7 7' />
                  )}
                </svg>
              </button>
            </div>

            <nav className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
              {publicLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={({isActive}) => isActive
                    ? 'flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-400 bg-yellow-400/10 text-base font-bold transition-colors'
                    : 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 text-base font-semibold transition-colors'}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated && memberLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({isActive}) => isActive
                    ? 'flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-400 bg-yellow-400/10 text-base font-bold transition-colors'
                    : 'flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 text-base font-semibold transition-colors'}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink
                  to='/admin'
                  className='flex items-center gap-3 px-4 py-3 rounded-xl text-yellow-400 hover:bg-yellow-400/10 text-base font-bold transition-colors'
                >
                  Admin Panel
                </NavLink>
              )}
            </nav>

            <div className='p-4 border-t border-gray-800 shrink-0'>
              <button
                onClick={() => {
                  logout();
                  showNotification?.('You have been logged out successfully.', 'success');
                }}
                className='w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-base font-bold transition-colors'
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Top Header for authenticated users */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              scrolled
                ? 'bg-gray-950/95 backdrop-blur-xl border-b border-yellow-400/10 shadow-lg shadow-black/20'
                : 'bg-gray-950/80 backdrop-blur-xl border-b border-transparent'
            }`}
          >
            <div className='flex items-center justify-between h-16 sm:h-18 md:h-20 px-3 sm:px-5 lg:px-6'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className='hidden xl:flex text-gray-400 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-800/50'
                  aria-label='Toggle sidebar'
                >
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    {sidebarOpen ? (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M11 19l-7-7 7-7m8 14l-7-7 7-7' />
                    ) : (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M13 5l7 7-7 7M5 5l7 7-7 7' />
                    )}
                  </svg>
                </button>
                <Link to='/' className='text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity'>UKGIN</Link>
              </div>

              <div className='flex items-center gap-2 sm:gap-3'>
                <button onClick={() => setSearchOpen(true)} className='hidden sm:flex text-gray-400 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-800/50' aria-label='Search'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /></svg>
                </button>

                <div className='relative' ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className={`transition relative p-2 rounded-lg hover:bg-gray-800/50 ${announcementCount > 0 ? 'text-red-400' : 'text-gray-400 hover:text-yellow-400'}`} aria-label='Notifications'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}><path strokeLinecap='round' strokeLinejoin='round' d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' /></svg>
                    {unreadCount > 0 && (
                      <span className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${hasNewNotifications ? 'animate-pulse-ring' : ''}`}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className='absolute left-0 top-12 w-full sm:left-auto sm:w-72 md:w-80 max-h-[70vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl z-50 animate-slide-in'>
                      <div className='flex items-center justify-between p-4 border-b border-gray-800'>
                        <span className='text-white font-bold text-sm'>Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className='text-yellow-400 text-xs font-bold hover:text-yellow-300 transition'>Mark all read</button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className='text-gray-400 text-sm p-4 text-center font-medium'>No notifications yet</p>
                      ) : (
                        <div className='divide-y divide-gray-800/50'>
                          {notifications.slice(0, 20).map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`w-full text-left p-4 hover:bg-gray-800/50 transition flex gap-3 ${notif.is_read ? 'opacity-60' : 'bg-gray-800/20'} ${!notif.is_read && notif.notification_type === 'announcement' ? 'border-l-2 border-red-500' : ''}`}
                            >
                              <div className='flex-1 min-w-0'>
                                <p className={`text-sm font-semibold truncate ${notif.is_read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</p>
                                <p className='text-gray-500 text-xs line-clamp-2 mt-0.5 font-medium'>{notif.message}</p>
                                <span className='text-gray-600 text-xs mt-1 block font-medium'>{new Date(notif.created_at).toLocaleString()}</span>
                              </div>
                              {!notif.is_read && <span className='w-2 h-2 rounded-full bg-yellow-400 mt-2 shrink-0' />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className='text-gray-300 text-sm font-semibold hidden xl:block'>{user?.first_name || 'User'}</span>
                <button onClick={() => navigate('/delete-account')} className='hover:text-red-400 transition text-sm font-semibold px-3 py-2 rounded-lg hover:bg-red-400/10 text-red-400'>Delete Account</button>
                <button onClick={() => {
                  logout();
                  showNotification?.('You have been logged out successfully.', 'success');
                }} className='hover:text-yellow-400 transition text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gray-800/50'>Logout</button>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className='xl:hidden text-gray-400 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-800/50'
                  aria-label='Toggle menu'
                >
                  <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    {mobileOpen ? (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                    ) : (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Drawer for authenticated users */}
          {mobileOpen && (
            <div className='xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={() => setMobileOpen(false)}>
              <div
                ref={mobileMenuRef}
                className='absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='p-6 border-b border-gray-800 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-gray-900 font-bold text-sm'>
                      {user?.first_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className='text-white font-bold text-sm'>{user?.first_name || 'User'}</p>
                      <p className='text-gray-400 text-xs'>{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                   <button type="button" onTouchStart={(e) => { e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }} className='text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50'>✕</button>
                </div>
                <div className='flex flex-col gap-1 p-4 max-h-[calc(100vh-5rem)] overflow-y-auto'>
                  {publicLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => { setMobileOpen(false); if (link.scroll) handleNavClick(new Event('click'), link.to); }}
                      className={({isActive}) => isActive ? 'text-yellow-400 font-bold py-3 px-4 rounded-xl bg-yellow-400/10 text-base min-h-[44px] flex items-center' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 py-3 px-4 rounded-xl transition text-base font-semibold min-h-[44px] flex items-center'}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {memberLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({isActive}) => isActive ? 'text-yellow-400 font-bold py-3 px-4 rounded-xl bg-yellow-400/10 text-base min-h-[44px] flex items-center' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 py-3 px-4 rounded-xl transition text-base font-semibold min-h-[44px] flex items-center'}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  {isAdmin && (
                    <NavLink to='/admin' onClick={() => setMobileOpen(false)} className='text-yellow-400 hover:text-yellow-300 font-bold py-3 px-4 rounded-xl hover:bg-yellow-400/10 transition text-base min-h-[44px] flex items-center'>Admin Panel</NavLink>
                  )}
                  <div className='border-t border-gray-800 pt-2 mt-2 flex flex-col gap-3'>
                    <span className='text-gray-300 text-sm px-4 font-medium'>{user?.first_name || 'User'}</span>
                    <button onClick={() => { navigate('/delete-account'); setMobileOpen(false); }} className='text-left text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 px-4 rounded-xl transition font-medium min-h-[44px] flex items-center'>Delete Account</button>
                    <button onClick={() => { logout(); setMobileOpen(false); showNotification?.('You have been logged out successfully.', 'success'); }} className='text-left text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 px-4 rounded-xl transition font-medium min-h-[44px] flex items-center'>Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Top Navbar for non-authenticated users - links spread with space-between */}
          <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              scrolled
                ? 'bg-gray-950/95 backdrop-blur-xl border-b border-yellow-400/10 shadow-lg shadow-black/20'
                : 'bg-gray-950/80 backdrop-blur-xl border-b border-transparent'
            }`}
          >
            <div className='flex items-center justify-between h-16 sm:h-18 md:h-20 px-3 sm:px-5 lg:px-6'>
              <Link to='/' className='text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight hover:opacity-80 transition-opacity'>UKGIN</Link>

              <nav className='hidden lg:flex items-center justify-around gap-1 xl:gap-2 text-sm xl:text-base font-bold'>
                {publicLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link.to)}
                    className={({isActive}) => isActive ? 'nav-link active px-2 py-2' : 'nav-link px-2 py-2'}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className='flex items-center gap-1 sm:gap-2'>
                <button onClick={() => setSearchOpen(true)} className='hidden sm:flex text-gray-400 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-800/50' aria-label='Search'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}><path strokeLinecap='round' strokeLinejoin='round' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' /></svg>
                </button>
                <NavLink to='/login' className='hidden lg:block hover:text-yellow-400 transition text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gray-800/50'>Login</NavLink>
                <NavLink to='/signup' className='hidden lg:block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors'>Sign Up</NavLink>

                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className='lg:hidden text-gray-400 hover:text-yellow-400 transition p-2 rounded-lg hover:bg-gray-800/50'
                  aria-label='Toggle menu'
                >
                  <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                    {mobileOpen ? (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                    ) : (
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Drawer for non-authenticated users */}
          {mobileOpen && (
            <div className='lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40' onClick={() => setMobileOpen(false)}>
              <div
                ref={mobileMenuRef}
                className='absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-xl border-l border-gray-800 shadow-2xl'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='p-6 border-b border-gray-800 flex items-center justify-between'>
                  <span className='text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent'>UKGIN</span>
                   <button type="button" onTouchStart={(e) => { e.stopPropagation(); }} onClick={(e) => { e.stopPropagation(); setMobileOpen(false); }} className='text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50'>✕</button>
                </div>
                <div className='flex flex-col gap-1 p-4 max-h-[calc(100vh-5rem)] overflow-y-auto'>
                  {publicLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => { setMobileOpen(false); if (link.scroll) handleNavClick(new Event('click'), link.to); }}
                      className={({isActive}) => isActive ? 'text-yellow-400 font-bold py-3 px-4 rounded-xl bg-yellow-400/10 text-base min-h-[44px] flex items-center' : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-800/50 py-3 px-4 rounded-xl transition text-base font-semibold min-h-[44px] flex items-center'}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                  <div className='border-t border-gray-800 pt-2 mt-2 flex flex-col gap-3'>
                    <NavLink to='/login' onClick={() => setMobileOpen(false)} className='text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 py-3 px-4 rounded-xl transition font-medium text-base min-h-[44px] flex items-center'>Login</NavLink>
                    <NavLink to='/signup' onClick={() => setMobileOpen(false)} className='bg-yellow-400 text-gray-900 text-center font-bold py-3 px-4 rounded-xl hover:bg-yellow-500 transition text-base min-h-[44px] flex items-center justify-center'>Sign Up</NavLink>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
