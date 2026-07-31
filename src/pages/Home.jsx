import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/announcements/`);
        setAnnouncements(res.data || []);
      } catch { setAnnouncements([]); }
    };
    fetchAnnouncements();
  }, []);

  if (isAuthenticated) {
    return (
      <div className='bg-gray-950 text-white min-h-screen pt-24 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-10'>
            <h1 className='text-4xl font-bold text-yellow-400 mb-2'>Welcome back, {user?.first_name || 'User'}!</h1>
            <p className='text-gray-400 text-lg'>Here is your UKGIN dashboard</p>
          </div>
          <div className='grid md:grid-cols-3 gap-6 mb-10'>
            <Link to='/state-chapters' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>📍</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>State Chapters</h3>
              <p className='text-gray-400 text-sm'>Explore and connect with UKGIN chapters in your area.</p>
            </Link>
            <Link to='/executive-leadership' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>👥</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Leadership</h3>
              <p className='text-gray-400 text-sm'>Meet our executive leadership team and coordinators.</p>
            </Link>
            <Link to='/events' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>📅</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Events</h3>
              <p className='text-gray-400 text-sm'>View upcoming events, meetings, and conferences.</p>
            </Link>
            <Link to='/constitution' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>📜</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Constitution</h3>
              <p className='text-gray-400 text-sm'>Read the UKGIN constitution and governing documents.</p>
            </Link>
            <Link to='/volunteer' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>🤝</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Volunteer</h3>
              <p className='text-gray-400 text-sm'>Join our volunteer programs and make an impact.</p>
            </Link>
            <Link to='/partners' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>🏢</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Partners</h3>
              <p className='text-gray-400 text-sm'>See our partners and collaboration opportunities.</p>
            </Link>
            <Link to='/sponsors' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>⭐</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Sponsors</h3>
              <p className='text-gray-400 text-sm'>Learn about our sponsors and how to support us.</p>
            </Link>
            <Link to='/gallery' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>🖼️</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Gallery</h3>
              <p className='text-gray-400 text-sm'>Browse photos and memories from UKGIN events.</p>
            </Link>
            <Link to='/donation' className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/50 transition'>
              <div className='text-3xl mb-3'>❤️</div>
              <h3 className='text-xl font-bold text-yellow-400 mb-2'>Donate</h3>
              <p className='text-gray-400 text-sm'>Support our mission with a donation.</p>
            </Link>
          </div>
          <div className='text-center'>
            <button onClick={logout} className='bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors'>Logout</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-950 text-white'>
      {/* Hero Banner */}
      <section className='h-screen bg-cover bg-center relative flex items-center justify-center text-center px-6' style={{ backgroundImage: "url('https://res.cloudinary.com/dtxdhkaqs/image/upload/v1779099458/men_women_with_ishiagu_w24uj4.png')" }}>
        <div className='absolute inset-0 bg-black/70'></div>
        <div className='relative z-10 max-w-5xl'>
          <h1 className='text-4xl md:text-7xl font-extrabold leading-tight'>
            UNITED KINGDOM OF GREAT IGBO NATION
          </h1>
          <p className='mt-6 text-lg md:text-xl text-gray-200 leading-8'>
            Bringing Ndi Igbo together globally through culture, empowerment,
            youth development and economic transformation.
          </p>
          <div className='mt-10 flex flex-wrap gap-4 justify-center'>
            <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold transition'>Become a Member</Link>
            <Link to='/login' className='border border-white hover:bg-white hover:text-black px-8 py-4 rounded-full transition'>Member Login</Link>
          </div>
        </div>
      </section>

       {/* Announcements */}
      {announcements.length > 0 && (
        <section className='py-12 px-6 md:px-20 bg-gray-900'>
          <div className='max-w-4xl mx-auto'>
            <h2 className='text-3xl font-bold text-yellow-400 text-center mb-8'>Latest Announcements</h2>
            <div className='space-y-4'>
              {announcements.map((ann) => (
                <div key={ann.id} className='bg-gray-800 p-6 rounded-2xl border border-gray-700'>
                  <h3 className='text-xl font-bold text-white mb-1'>{ann.title}</h3>
                  <p className='text-gray-300 text-sm'>{ann.message}</p>
                  <span className='text-gray-500 text-xs mt-2 block'>{new Date(ann.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className='py-20 px-6 md:px-20'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl font-bold text-yellow-400 text-center mb-12'>Our Mission & Vision</h2>
          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800'>
              <h3 className='text-2xl font-bold text-yellow-400 mb-4'>Our Mission</h3>
              <p className='text-gray-300 leading-8'>To unite Ndi Igbo worldwide through cultural preservation, youth empowerment, economic development, and community building. We strive to create a global network that supports Igbo identity, promotes educational excellence, and drives positive change in every community we serve.</p>
            </div>
            <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800'>
              <h3 className='text-2xl font-bold text-yellow-400 mb-4'>Our Vision</h3>
              <p className='text-gray-300 leading-8'>A united and empowered global Igbo community that preserves its rich heritage while driving innovation, economic prosperity, and social progress. We envision a world where every Igbo person feels connected, valued, and equipped to make a difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      <section className='py-20 px-6 md:px-20 bg-gray-900'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl font-bold text-yellow-400 mb-6'>Become a Member</h2>
          <p className='text-gray-300 text-lg mb-8'>Join UKGIN worldwide and be part of a community that promotes Igbo unity, culture, and economic empowerment.</p>
          <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full font-bold transition text-lg'>Join UKGIN Today</Link>
        </div>
      </section>

      {/* Donate CTA */}
      <section className='py-20 px-6 md:px-20'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl font-bold text-yellow-400 mb-6'>Support Our Mission</h2>
          <p className='text-gray-300 text-lg mb-8'>Your donation helps empower youths, preserve Igbo culture, and build economic opportunities for the community.</p>
          <Link to='/donation' className='bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full font-bold transition text-lg'>Donate Now</Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className='py-16 px-6 md:px-20 bg-gray-900'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='text-3xl font-bold text-yellow-400 mb-4'>Stay Connected</h2>
          <p className='text-gray-400 mb-6'>Subscribe to our newsletter for the latest updates and events.</p>
          <form className='flex flex-col sm:flex-row gap-4'>
            <input type='email' placeholder='Your email address' className='flex-1 bg-black p-4 rounded-xl border border-gray-700 text-white' required />
            <button type='submit' className='bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition'>Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
