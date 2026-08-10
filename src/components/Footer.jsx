import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const socialIcons = {
  facebook: { icon: 'fab fa-facebook-f', label: 'Facebook', name: 'Facebook' },
  twitter: { icon: 'fab fa-twitter', label: 'Twitter', name: 'Twitter' },
  instagram: { icon: 'fab fa-instagram', label: 'Instagram', name: 'Instagram' },
  linkedin: { icon: 'fab fa-linkedin-in', label: 'LinkedIn', name: 'LinkedIn' },
  youtube: { icon: 'fab fa-youtube', label: 'YouTube', name: 'YouTube' },
  tiktok: { icon: 'fab fa-tiktok', label: 'TikTok', name: 'TikTok' },
  whatsapp: { icon: 'fab fa-whatsapp', label: 'WhatsApp', name: 'WhatsApp' },
  telegram: { icon: 'fab fa-telegram-plane', label: 'Telegram', name: 'Telegram' },
  github: { icon: 'fab fa-github', label: 'GitHub', name: 'GitHub' },
  other: { icon: 'fas fa-link', label: 'Website', name: 'Other' },
};

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState([]);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [showUnsubscribe, setShowUnsubscribe] = useState(false);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/social-media-links/`);
      const links = res.data || [];
      const withWhatsApp = [...links];
      if (!withWhatsApp.some(l => l.name === 'whatsapp')) {
        withWhatsApp.push({ id: 0, name: 'whatsapp', url: 'https://wa.me/15625278703', icon_class: 'fab fa-whatsapp', is_active: true, order: 5 });
      }
      setSocialLinks(withWhatsApp);
      } catch {
        setSocialLinks([
          { id: 0, name: 'facebook', url: 'https://facebook.com/groups/1192866455574424/', icon_class: 'fab fa-facebook-f', is_active: true, order: 0 },
          { id: 1, name: 'twitter', url: '#', icon_class: 'fab fa-twitter', is_active: true, order: 1 },
          { id: 2, name: 'instagram', url: '#', icon_class: 'fab fa-instagram', is_active: true, order: 2 },
          { id: 3, name: 'linkedin', url: '#', icon_class: 'fab fa-linkedin-in', is_active: true, order: 3 },
          { id: 4, name: 'youtube', url: '#', icon_class: 'fab fa-youtube', is_active: true, order: 4 },
          { id: 5, name: 'whatsapp', url: 'https://wa.me/15625278703', icon_class: 'fab fa-whatsapp', is_active: true, order: 5 },
        ]);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/public/newsletter-subscribe/`, { email });
      const detail = response.data?.detail || 'Subscribed successfully!';
      setSubscribed(true);
      setEmail('');
      alert(detail);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Subscription failed. Please try again.';
      alert(detail);
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setUnsubscribing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/public/newsletter-unsubscribe/`, { email });
      const detail = response.data?.detail || 'Unsubscribed successfully.';
      setSubscribed(false);
      setEmail('');
      setShowUnsubscribe(false);
      alert(detail);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Unsubscribe failed. Please try again.';
      alert(detail);
    } finally {
      setUnsubscribing(false);
    }
  };

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

  const legalLinks = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Cookie Policy', path: '/cookies' },
    { label: 'Refund Policy', path: '/refunds' },
    { label: 'Constitution Download', path: '/constitution' },
  ];

  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent tracking-tight inline-block mb-4">UKGIN</Link>
            <p className="text-gray-400 text-sm leading-7">
              Promoting Igbo Unity & Culture Worldwide. United Kingdom of Great Igbo Nation is a global organization dedicated to uniting Ndi Igbo across the globe.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {quickLinks.map((link) => (
                <Link key={link.path} to={link.path} className="block text-gray-400 hover:text-yellow-400 text-base transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">Legal</h3>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link key={link.path} to={link.path} className="block text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">Contact</h3>
            <div className="space-y-3 text-gray-400 text-sm leading-7">
              <p>Suite No 3 The Princess Plaza, Along Ado Road, By Lagos High Court Complex, Ajah, Lekki, Lagos, Nigeria. P.O. Box 57044 Ikoyi, Lagos.</p>
              <p><span className="text-yellow-400">Emergency:</span> +234 803 085 0814</p>
              <p><span className="text-yellow-400">US:</span> +1 562-527-8703</p>
              <p><span className="text-yellow-400">Local:</span> +234 901 425 7657</p>
              <p><span className="text-yellow-400">Email:</span> info@ukgin.org</p>
              <p><span className="text-yellow-400">Hours:</span> Mon-Fri 9AM - 5PM WAT</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-10 mb-10">
          <h3 className="text-white font-bold text-base mb-5 uppercase tracking-wider">Stay Connected</h3>
          {subscribed ? (
            <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-5 rounded-2xl text-sm max-w-lg">
              You are subscribed! Check your email for a confirmation.
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg" onSubmit={handleSubscribe}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 p-4 rounded-xl border border-gray-700 text-white text-sm focus:border-yellow-400 focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {subscribing ? 'Signing Up...' : 'Subscribe'}
              </button>
            </form>
          )}
          <button
            type="button"
            onClick={() => setShowUnsubscribe(!showUnsubscribe)}
            className="text-gray-400 hover:text-red-400 text-sm mt-3 transition-colors"
          >
            Unsubscribe from newsletter
          </button>
          {showUnsubscribe && (
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mt-4" onSubmit={handleUnsubscribe}>
              <label htmlFor="unsubscribe-email" className="sr-only">Email address</label>
              <input
                id="unsubscribe-email"
                type="email"
                placeholder="Enter your email to unsubscribe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-900 p-4 rounded-xl border border-gray-700 text-white text-sm focus:border-red-400 focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                disabled={unsubscribing}
                className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            </form>
          )}
        </div>

        <div className="border-t border-gray-800 pt-8 mb-8 flex flex-wrap gap-3 justify-center">
          {socialLinks.map((link, i) => {
            const meta = socialIcons[link.name] || socialIcons.other;
            return (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl text-gray-300 hover:text-yellow-400 hover:bg-gray-700 transition text-xl"
                title={meta.label}
                aria-label={meta.label}
              >
                <i className={link.icon_class || meta.icon}></i>
              </a>
            );
          })}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">2026 UKGIN. All Rights Reserved.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-yellow-400 hover:text-yellow-300 text-xs font-medium transition-colors flex items-center gap-1"
            aria-label="Back to top"
          >
            Back to Top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
