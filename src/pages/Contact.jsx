import { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/social-media-links/`);
        setSocialLinks(res.data || []);
      } catch {
        setSocialLinks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/users/public/contact-message/`, formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const socialIcons = {
    facebook: { icon: 'fab fa-facebook-f', label: 'Facebook' },
    twitter: { icon: 'fab fa-twitter', label: 'Twitter' },
    instagram: { icon: 'fab fa-instagram', label: 'Instagram' },
    linkedin: { icon: 'fab fa-linkedin-in', label: 'LinkedIn' },
    youtube: { icon: 'fab fa-youtube', label: 'YouTube' },
    tiktok: { icon: 'fab fa-tiktok', label: 'TikTok' },
    whatsapp: { icon: 'fab fa-whatsapp', label: 'WhatsApp' },
    telegram: { icon: 'fab fa-telegram-plane', label: 'Telegram' },
    github: { icon: 'fab fa-github', label: 'GitHub' },
    other: { icon: 'fas fa-link', label: 'Website' },
  };

  const inputBase = 'w-full bg-black p-4 rounded-2xl border-2 border-gray-700 text-white text-lg focus:border-yellow-400 focus:outline-none transition-colors';

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Message Sent!</h1>
            <p className="text-gray-300 leading-7 mb-6">
              Thank you for reaching out. Your message has been sent successfully. Our team will respond within 24-48 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6 text-center">Contact Us</h1>
        <p className="text-gray-300 text-xl md:text-2xl mb-10 text-center">We would love to hear from you. Send us a message and our team will get back to you.</p>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-800 space-y-4">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-32" />
              <Skeleton className="w-full h-14" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-900 p-7 rounded-3xl border border-gray-800 space-y-3">
                  <Skeleton className="w-1/3 h-6" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-800">
              <h2 className="text-3xl md:text-4xl font-extrabold text-yellow-400 mb-8">Send a Message</h2>
              {error && (
                <div className="bg-red-500/15 text-red-300 p-5 rounded-2xl mb-6 border-2 border-red-500/30 text-lg" role="alert">
                  {error}
                </div>
              )}
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contact-name" className="sr-only">Your Name</label>
                  <input id="contact-name" type="text" placeholder="Your Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputBase} />
                </div>
                <div>
                  <label htmlFor="contact-email" className="sr-only">Your Email</label>
                  <input id="contact-email" type="email" placeholder="Your Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputBase} />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="sr-only">Subject</label>
                  <input id="contact-subject" type="text" placeholder="Subject *" required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputBase} />
                </div>
                <div>
                  <label htmlFor="contact-message" className="sr-only">Your message</label>
                  <textarea id="contact-message" placeholder="Your message..." rows="5" required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={`${inputBase} resize-none`} />
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-xl">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800">
                <h3 className="text-yellow-400 font-extrabold mb-3 text-2xl">Office Address</h3>
                <p className="text-gray-300 text-lg leading-8">
                  Suite No 3 The Princess Plaza,<br />
                  Along Ado Road,<br />
                  By Lagos High Court Complex,<br />
                  Ajah, Lekki, Lagos, Nigeria.<br />
                  P.O. Box 57044 Ikoyi, Lagos.
                </p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800">
                <h3 className="text-yellow-400 font-extrabold mb-3 text-2xl">Phone Numbers</h3>
                <p className="text-gray-300 text-lg mb-2">Emergency: +234 803 085 0814</p>
                <p className="text-gray-300 text-lg">+1 562-527-8703 (US)</p>
                <p className="text-gray-300 text-lg">+234 901 425 7657</p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800">
                <h3 className="text-yellow-400 font-extrabold mb-3 text-2xl">Email</h3>
                <p className="text-gray-300 text-lg">info@ukgin.org</p>
                <p className="text-gray-300 text-lg">support@ukgin.org</p>
                <p className="text-gray-300 text-lg">events@ukgin.org</p>
              </div>
              <div className="bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800">
                <h3 className="text-yellow-400 font-extrabold mb-3 text-2xl">Business Hours</h3>
                <p className="text-gray-300 text-lg">Mon-Fri: 9AM - 5PM WAT</p>
                <p className="text-gray-300 text-lg">Sat: 10AM - 2PM WAT</p>
                <p className="text-gray-300 text-lg">Sun: Closed</p>
              </div>
              {socialLinks.length > 0 && (
                <div className="bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800">
                  <h3 className="text-yellow-400 font-extrabold mb-3 text-2xl">Follow Us</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => {
                      const meta = socialIcons[link.name] || socialIcons.other;
                      return (
                        <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl text-gray-300 hover:text-yellow-400 hover:bg-gray-700 transition" title={meta.label} aria-label={meta.label}>
                          <i className={meta.icon}></i>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
