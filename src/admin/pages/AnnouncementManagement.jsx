import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/announcements/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const openCreate = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', message: '', is_active: true });
  };

  const openEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      message: announcement.message || '',
      is_active: announcement.is_active !== undefined ? announcement.is_active : true,
    });
  };

  const closeForm = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', message: '', is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAnnouncement) {
        await axios.patch(`${API_BASE_URL}/users/announcements/${editingAnnouncement.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/announcements/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchAnnouncements();
      closeForm();
    } catch (err) { console.error(err); alert('Failed to save announcement.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/announcements/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (err) { console.error(err); alert('Failed to delete announcement.'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Announcements</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          + New Announcement
        </button>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Message *</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            Active (visible to users)
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">
              {saving ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">ID</th>
              <th className="text-left p-3 text-gray-400">Title</th>
              <th className="text-left p-3 text-gray-400">Message</th>
              <th className="text-left p-3 text-gray-400">Status</th>
              <th className="text-left p-3 text-gray-400">Author</th>
              <th className="text-left p-3 text-gray-400">Date</th>
              <th className="text-left p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((ann) => (
              <tr key={ann.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{ann.id}</td>
                <td className="p-3 text-white font-bold">{ann.title}</td>
                <td className="p-3 text-gray-400 max-w-xs truncate">{ann.message}</td>
                <td className="p-3">{ann.is_active ? <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Active</span> : <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs">Inactive</span>}</td>
                <td className="p-3 text-gray-400 text-xs">{ann.author_name || 'System'}</td>
                <td className="p-3 text-gray-400 text-xs">{new Date(ann.created_at).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(ann)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Edit</button>
                    <button onClick={() => handleDelete(ann.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {announcements.length === 0 && !loading && (
        <p className="text-gray-400 text-center py-8">No announcements found. Create your first announcement!</p>
      )}
    </div>
  );
};

export default AnnouncementManagement;
