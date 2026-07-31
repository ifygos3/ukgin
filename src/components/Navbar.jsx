import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import { useAuth } from '../contexts/AuthContext';
import "./Navbar.css"

const Navbar = ({ showNotification }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/events', label: 'Events' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contact', label: 'Contact' },
  ];

  const memberLinks = [
    { to: '/state-chapters', label: 'Chapters' },
    { to: '/executive-leadership', label: 'Leadership' },
    { to: '/constitution', label: 'Constitution' },
    { to: '/partners', label: 'Partners' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/sponsors', label: 'Sponsors' },
  ];

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-lg border-b border-white/10'>
      <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-4'>
        <div>
          <Link to='/' className='text-2xl font-bold text-yellow-400'>UKGIN</Link>
          <p className='text-xs text-gray-300 hidden sm:block'>UNITED KINGDOM OF GREAT IGBO NATION</p>
        </div>

        <div className='hidden lg:flex gap-6 text-sm items-center'>
          {publicLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{link.label}</NavLink>
          ))}
          {isAuthenticated && memberLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>{link.label}</NavLink>
          ))}
          {isAdmin && (
            <NavLink to='/admin' className='text-yellow-400 hover:text-yellow-300 transition'>Admin Panel</NavLink>
          )}
        </div>

        <div className='hidden lg:flex items-center gap-4'>
          <button onClick={() => setSearchOpen(true)} className='text-gray-400 hover:text-yellow-400 transition'>🔍</button>
          {isAuthenticated ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-300 text-sm'>{user?.first_name || 'User'}</span>
              <button onClick={() => {
                logout();
                showNotification?.('You have been logged out successfully.', 'success');
              }} className='hover:text-yellow-400 transition text-sm'>Logout</button>
            </div>
          ) : (
            <>
              <NavLink to='/login' className='hover:text-yellow-400 transition'>Login</NavLink>
              <NavLink to='/signup' className='hover:text-yellow-400 transition'>Sign Up</NavLink>
            </>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className='lg:hidden text-gray-400 hover:text-yellow-400 transition text-2xl'>
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileOpen && (
        <div className='lg:hidden bg-gray-900 border-t border-gray-800 px-6 py-4'>
          <div className='flex flex-col gap-3'>
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={({isActive}) => isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}>{link.label}</NavLink>
            ))}
            {isAuthenticated && memberLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={({isActive}) => isActive ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"}>{link.label}</NavLink>
            ))}
            {isAdmin && (
              <NavLink to='/admin' onClick={() => setMobileOpen(false)} className='text-yellow-400 hover:text-yellow-300'>Admin Panel</NavLink>
            )}
            <div className='border-t border-gray-800 pt-3 mt-3 flex flex-col gap-3'>
              {isAuthenticated ? (
                <>
                  <span className='text-gray-300 text-sm'>{user?.first_name || 'User'}</span>
                  <button onClick={() => { logout(); setMobileOpen(false); showNotification?.('You have been logged out successfully.', 'success'); }} className='text-left text-red-400 hover:text-red-300'>Logout</button>
                </>
              ) : (
                <>
                  <NavLink to='/login' onClick={() => setMobileOpen(false)} className='text-yellow-400 hover:text-yellow-300'>Login</NavLink>
                  <NavLink to='/signup' onClick={() => setMobileOpen(false)} className='text-yellow-400 hover:text-yellow-300'>Sign Up</NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </nav>
  );
};

export default Navbar;
