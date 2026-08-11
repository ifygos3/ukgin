import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '', notification_type: 'announcement', sent_to_all: true });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const openCreate = () => {
    setEditingNotification(null);
    setFormData({ title: '', message: '', notification_type: 'announcement', sent_to_all: true });
  };

  const openEdit = (notif) => {
    setEditingNotification(notif);
    setFormData({
      title: notif.title || '',
      message: notif.message || '',
      notification_type: notif.notification_type || 'announcement',
      sent_to_all: notif.sent_to_all || false,
    });
  };

  const closeForm = () => {
    setEditingNotification(null);
    setFormData({ title: '', message: '', notification_type: 'announcement', sent_to_all: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingNotification) {
        await axios.patch(`${API_BASE_URL}/users/notifications/${editingNotification.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        showNotification('Notification updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users/notifications/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        showNotification('Notification sent successfully.', 'success');
      }
      fetchNotifications();
      closeForm();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save notification.', 'error');
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/notifications/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(notifications.filter(n => n.id !== id));
      showNotification('Notification deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete notification.', 'error'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Notification System</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          + New Notification
        </button>
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingNotification ? 'Edit Notification' : 'Send New Notification'}</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="bg-black p-3 rounded-xl border border-gray-700 text-white" required />
          <select name="notification_type" value={formData.notification_type} onChange={handleChange} className="bg-black p-3 rounded-xl border border-gray-700 text-white">
            <option value="announcement">Announcement</option>
            <option value="email">Email</option>
            <option value="in_app">In-App</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-4" required />
        <label className="flex items-center gap-2 text-gray-300 mb-4">
          <input type="checkbox" name="sent_to_all" checked={formData.sent_to_all} onChange={handleChange} />
          Send to all users
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 disabled:opacity-50">{saving ? 'Saving...' : (editingNotification ? 'Update' : 'Send')}</button>
          {editingNotification && (
            <button type="button" onClick={closeForm} className="bg-gray-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-600">Cancel</button>
          )}
        </div>
      </form>
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white font-bold">{notif.title}</span>
              <span className="text-gray-500 text-xs">{new Date(notif.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">{notif.message}</p>
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-xs ${notif.notification_type === 'announcement' ? 'bg-yellow-500/20 text-yellow-300' : notif.notification_type === 'email' ? 'bg-blue-500/20 text-blue-300' : notif.notification_type === 'maintenance' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                {notif.notification_type}
              </span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(notif)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Edit</button>
                <button onClick={() => handleDelete(notif.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManagement;
