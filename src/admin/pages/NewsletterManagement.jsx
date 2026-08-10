import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const NewsletterManagement = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [sendingId, setSendingId] = useState(null);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchNewsletters = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/newsletters/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsletters(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchNewsletters(); }, [fetchNewsletters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API_BASE_URL}/users/newsletters/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      showNotification('Newsletter created successfully.', 'success');
      setFormData({ subject: '', message: '' });
      setShowForm(false);
      fetchNewsletters();
    } catch (err) {
      console.error(err);
      showNotification('Failed to create newsletter.', 'error');
    }
    finally { setSending(false); }
  };

  const handleSend = async (id) => {
    setSendingId(id);
    try {
      const res = await axios.post(`${API_BASE_URL}/users/newsletters/${id}/send/`, {}, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      showNotification(res.data.detail || 'Newsletter sent successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to send newsletter.', 'error');
    }
    finally { setSendingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/newsletters/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setNewsletters(newsletters.filter(n => n.id !== id));
      showNotification('Newsletter deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete newsletter.', 'error'); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Newsletter Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          {showForm ? 'Cancel' : '+ New Newsletter'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Compose Newsletter</h2>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Newsletter subject" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Write your newsletter content here..." rows="6" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={sending} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50">{saving ? 'Saving...' : 'Save Newsletter'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      )}
      <div className="space-y-4">
        {newsletters.map((newsletter) => (
          <div key={newsletter.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-bold">{newsletter.subject}</span>
              <span className="text-gray-500 text-xs">{new Date(newsletter.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">{newsletter.message}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs ${newsletter.sent_to_all ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {newsletter.sent_to_all ? 'Sent' : 'Draft'}
              </span>
              <div className="flex gap-2">
                {!newsletter.sent_to_all && (
                  <button onClick={() => handleSend(newsletter.id)} disabled={sendingId === newsletter.id} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-500 disabled:opacity-50">
                    {sendingId === newsletter.id ? 'Sending...' : 'Send'}
                  </button>
                )}
                <button onClick={() => handleDelete(newsletter.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsletterManagement;
