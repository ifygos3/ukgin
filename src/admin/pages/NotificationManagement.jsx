import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', message: '', notification_type: 'announcement', sent_to_all: true });
  const token = localStorage.getItem('access_token');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(        `${API_BASE_URL}/users/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(        `${API_BASE_URL}/users/notifications/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setFormData({ title: '', message: '', notification_type: 'announcement', sent_to_all: true });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Notification System</h1>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Send Announcement</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" className="bg-black p-3 rounded-xl border border-gray-700 text-white" required />
          <select value={formData.notification_type} onChange={(e) => setFormData({ ...formData, notification_type: e.target.value })} className="bg-black p-3 rounded-xl border border-gray-700 text-white">
            <option value="announcement">Announcement</option>
            <option value="email">Email</option>
            <option value="in_app">In-App</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Message" rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-4" required />
        <label className="flex items-center gap-2 text-gray-300 mb-4">
          <input type="checkbox" checked={formData.sent_to_all} onChange={(e) => setFormData({ ...formData, sent_to_all: e.target.checked })} />
          Send to all users
        </label>
        <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">Send Notification</button>
      </form>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-bold">{notif.title}</span>
              <span className="text-gray-500 text-xs">{new Date(notif.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
            <span className={`px-2 py-1 rounded text-xs ${notif.notification_type === 'announcement' ? 'bg-yellow-500/20 text-yellow-300' : notif.notification_type === 'email' ? 'bg-blue-500/20 text-blue-300' : notif.notification_type === 'maintenance' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              {notif.notification_type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManagement;