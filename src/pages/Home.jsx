import MissionVision from './MissionVision';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Skeleton, CardSkeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { showNotification } = useNotification();
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/announcements/`);
        const data = res.data || [];
        setAnnouncements(data);
        if (data.length > 0) {
          const latest = data[0];
          const seen = JSON.parse(localStorage.getItem('seen_announcements') || '[]');
          if (!seen.includes(latest.id)) {
            showNotification(latest.title, 'announcement');
            seen.push(latest.id);
            localStorage.setItem('seen_announcements', JSON.stringify(seen));
          }
        }
      } catch {
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, [showNotification]);

  if (isAuthenticated) {
    return (
      <div className='bg-gray-950 text-white min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-16'>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-5xl md:text-6xl font-extrabold text-yellow-400 mb-3'
            >
              Welcome back, {user?.first_name || 'User'}!
            </motion.h1>
            <p className='text-gray-300 text-xl md:text-2xl'>Here is your UKGIN dashboard</p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7 mb-10'>
            {[
              { to: '/state-chapters', icon: '📍', title: 'State Chapters', desc: 'Explore and connect with UKGIN chapters in your area.' },
              { to: '/executive-leadership', icon: '👥', title: 'Leadership', desc: 'Meet our executive leadership team and coordinators.' },
              { to: '/events', icon: '📅', title: 'Events', desc: 'View upcoming events, meetings, and conferences.' },
              { to: '/constitution', icon: '📜', title: 'Constitution', desc: 'Read the UKGIN constitution and governing documents.' },
              { to: '/volunteer', icon: '🤝', title: 'Volunteer', desc: 'Join our volunteer programs and make an impact.' },
              { to: '/partners', icon: '🏢', title: 'Partners', desc: 'See our partners and collaboration opportunities.' },
              { to: '/sponsors', icon: '⭐', title: 'Sponsors', desc: 'Learn about our sponsors and how to support us.' },
              { to: '/gallery', icon: '🖼️', title: 'Gallery', desc: 'Browse photos and memories from UKGIN events.' },
              { to: '/donation', icon: '❤️', title: 'Donate', desc: 'Support our mission with a donation.' },
            ].map((item, i) => (
              <Link key={item.to} to={item.to} className='bg-gray-900/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-800 hover:border-yellow-400/60 transition-all duration-300 hover:scale-[1.02] block group'>
                <div className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'>{item.icon}</div>
                <h3 className='text-2xl font-extrabold text-yellow-400 mb-2'>{item.title}</h3>
                <p className='text-gray-300 text-lg leading-7'>{item.desc}</p>
              </Link>
            ))}
          </div>
          <div className='text-center'>
            <button onClick={logout} className='bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold transition-colors text-xl'>Logout</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-950 text-white'>
      <section className='h-screen bg-cover bg-center relative flex items-center justify-center text-center px-6 pt-16 sm:pt-20' style={{ backgroundImage: "url('https://res.cloudinary.com/dtxdhkaqs/image/upload/v1779099458/men_women_with_ishiagu_w24uj4.png')" }}>
        <div className='absolute inset-0 bg-black/65'></div>
        <motion.div
          initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className='relative z-10 max-w-7xl w-full'
        >
          <motion.h1
            initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className='text-4xl md:text-7xl font-black leading-tight text-white text-balance tracking-wide'
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.95)' }}
          >
            UNITED KINGDOM<br className='hidden md:inline' /> OF<br className='md:hidden' /> GREAT IGBO NATION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className='mt-6 md:text-5xl text-gray-300 leading-relaxed'
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}
          >
            Bringing Ndi Igbo together globally through culture, empowerment, youth development and economic transformation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 15 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.45 }}
            className='mt-12 flex flex-wrap gap-6 justify-center'
          >
            <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-full font-bold transition text-base md:text-lg'>Become a Member</Link>
            <Link to='/login' className='border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-full transition text-base md:text-lg font-bold'>Member Login</Link>
          </motion.div>
        </motion.div>
      </section>

      {announcements.length > 0 && (
        <section className='py-16 px-4 sm:px-6 md:px-8 bg-gray-900/50'>
          <div className='max-w-5xl mx-auto'>
            <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 text-center mb-10'>Latest Announcements</h2>
            {loadingAnnouncements ? (
              <div className='space-y-6'>
                {[1, 2, 3].map(i => (
                  <div key={i} className='bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-800'>
                    <Skeleton className='w-1/3 h-6 mb-4' />
                    <Skeleton className='w-full h-4 mb-2' />
                    <Skeleton className='w-full h-4 mb-2' />
                    <Skeleton className='w-1/2 h-4' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-6'>
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-yellow-400/20 shadow-xl hover:border-yellow-400/40 transition-colors'>
                    <h3 className='text-2xl md:text-3xl font-extrabold text-white mb-3'>{ann.title}</h3>
                    <p className='text-gray-200 text-lg leading-8'>{ann.message}</p>
                    <span className='text-yellow-400 text-sm mt-4 block font-bold'>{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className='py-24 px-4 sm:px-6 md:px-8'>
        <div className='max-w-7xl mx-auto'>
          <MissionVision isMobile={isMobile} />
        </div>
      </section>

      <section className='py-24 px-4 sm:px-6 md:px-8 bg-gray-900/50'>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-5xl md:text-6xl font-extrabold text-yellow-400 mb-8'>Become a Member</h2>
          <p className='text-gray-200 text-xl md:text-2xl mb-10 leading-10'>Join UKGIN worldwide and be part of a community that promotes Igbo unity, culture, and economic empowerment.</p>
          <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-full font-bold transition text-xl md:text-2xl'>Join UKGIN Today</Link>
        </div>
      </section>

      <section className='py-24 px-4 sm:px-6 md:px-8'>
        <div className='max-w-5xl mx-auto text-center'>
          <h2 className='text-5xl md:text-6xl font-extrabold text-yellow-400 mb-8'>Support Our Mission</h2>
          <p className='text-gray-200 text-xl md:text-2xl mb-10 leading-10'>Your donation helps empower youths, preserve Igbo culture, and build economic opportunities for the community.</p>
          <Link to='/donation' className='bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-full font-bold transition text-xl md:text-2xl'>Donate Now</Link>
        </div>
      </section>

      <section className='py-20 px-4 sm:px-6 md:px-8 bg-gray-900/50'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6'>Stay Connected</h2>
          <p className='text-gray-400 mb-6'>Subscribe to our newsletter for the latest updates and events.</p>
          <form className='flex flex-col sm:flex-row gap-5' onSubmit={async (e) => {
            e.preventDefault();
            const email = e.target.elements.email.value;
            if (!email) return;
            try {
              const response = await axios.post(`${API_BASE_URL}/users/public/newsletter-subscribe/`, { email });
              const detail = response.data?.detail || 'Subscribed successfully!';
              e.target.reset();
              alert(detail);
            } catch (err) {
              const detail = err?.response?.data?.detail || 'Subscription failed. Please try again.';
              alert(detail);
            }
          }}>
            <input name='email' type='email' placeholder='Your email address' className='flex-1 bg-black p-5 rounded-2xl border-2 border-gray-700 text-white text-lg focus:border-yellow-400 focus:outline-none transition-colors' required />
            <button type='submit' className='bg-yellow-500 text-black px-10 py-5 rounded-2xl font-bold hover:bg-yellow-400 transition text-lg'>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
