import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({ title: '', message: '', is_active: true });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

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
      showNotification(editingAnnouncement ? 'Announcement updated successfully.' : 'Announcement created successfully.', 'success');
      closeForm();
    } catch (err) { console.error(err);       showNotification('Failed to save announcement.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/announcements/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setAnnouncements(announcements.filter(a => a.id !== id));
      showNotification('Announcement deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete announcement.', 'error'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Announcements</h1>
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

      <div className="w-full overflow-x-auto overscroll-x-contain" style={{WebkitOverflowScrolling: 'touch', touchAction: 'pan-x'}}>
        <div className="min-w-[720px] w-full">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{tableLayout: 'fixed'}}>
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Title</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Message</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Author</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Date</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann) => (
                <tr key={ann.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{ann.id}</td>
                  <td className="p-2 sm:p-3 text-white font-bold text-xs sm:text-sm whitespace-nowrap">{ann.title}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm max-w-xs truncate">{ann.message}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{ann.is_active ? <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Active</span> : <span className="bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Inactive</span>}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{ann.author_name || 'System'}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(ann.created_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      <button onClick={() => openEdit(ann)} className="text-blue-400 hover:text-blue-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(ann.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {announcements.length === 0 && !loading && (
        <p className="text-gray-400 text-center py-8">No announcements found. Create your first announcement!</p>
      )}
    </div>
  );
};

export default AnnouncementManagement;
