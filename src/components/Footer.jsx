import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Membership', path: '/signup' },
    { label: 'Donate', path: '/donation' },
    { label: 'Constitution', path: '/constitution' },
    { label: 'News', path: '/news' },
    { label: 'Events', path: '/events' },
    { label: 'Projects', path: '/projects' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blog', path: '/blog' },
    { label: 'FAQs', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Volunteer', path: '/volunteer' },
  ];

  const quickLinks2 = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Refund Policy', path: '/refunds' },
    { label: 'Constitution Download', path: '/constitution' },
  ];

  return (
    <footer className='bg-black border-t border-white/10 py-16'>
      <div className='max-w-7xl mx-auto px-6 md:px-20'>
        <div className='grid md:grid-cols-4 gap-8 mb-12'>
          <div>
            <h2 className='text-2xl font-bold text-yellow-400 mb-4'>UKGIN</h2>
            <p className='text-gray-400 text-sm leading-6'>Promoting Igbo Unity & Culture Worldwide. United Kingdom of Great Igbo Nation is a global organization dedicated to uniting Ndi Igbo across the globe.</p>
          </div>
          <div>
            <h3 className='text-white font-bold mb-4'>Quick Links</h3>
            <div className='grid grid-cols-2 gap-2'>
              {quickLinks.map((link, i) => (
                <Link key={i} to={link.path} className='block text-gray-400 hover:text-yellow-400 text-sm transition'>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-white font-bold mb-4'>Legal</h3>
            <div className='space-y-2'>
              {quickLinks2.map((link, i) => (
                <Link key={i} to={link.path} className='block text-gray-400 hover:text-yellow-400 text-sm transition'>{link.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-white font-bold mb-4'>Contact</h3>
            <div className='space-y-2 text-gray-400 text-sm'>
              <p>📍 123 Igbo Way, Lagos, Nigeria</p>
              <p>📞 +234 123 456 7890</p>
              <p>📞 +44 20 1234 5678 (UK)</p>
              <p>✉️ info@ukgin.org</p>
              <p>🕐 Mon-Fri: 9AM - 5PM WAT</p>
              <p>📱 Emergency: +234 987 654 3210</p>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className='border-t border-gray-800 pt-8 mb-8'>
          <h3 className='text-white font-bold mb-4'>Stay Connected</h3>
          <form className='flex flex-col sm:flex-row gap-4 max-w-md'>
            <input type='email' placeholder='Your email address' className='flex-1 bg-gray-900 p-3 rounded-xl border border-gray-700 text-white text-sm' required />
            <button type='submit' className='bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 transition'>Subscribe</button>
          </form>
        </div>

        {/* Social Media */}
        <div className='border-t border-gray-800 pt-8 mb-8 flex flex-wrap gap-4 justify-center'>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>Facebook</a>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>Twitter</a>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>Instagram</a>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>LinkedIn</a>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>YouTube</a>
          <a href='#' className='text-gray-400 hover:text-yellow-400 transition text-sm'>TikTok</a>
        </div>

        <div className='border-t border-gray-800 pt-6 flex flex-wrap justify-between items-center gap-4'>
          <p className='text-gray-500 text-xs'>© 2026 UKGIN. All Rights Reserved.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='text-yellow-400 hover:text-yellow-300 text-xs'>↑ Back to Top</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;