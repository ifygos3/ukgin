import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PLATFORM_ICONS = {
  facebook: 'fab fa-facebook-f',
  twitter: 'fab fa-twitter',
  instagram: 'fab fa-instagram',
  linkedin: 'fab fa-linkedin-in',
  youtube: 'fab fa-youtube',
  tiktok: 'fab fa-tiktok',
  whatsapp: 'fab fa-whatsapp',
  telegram: 'fab fa-telegram-plane',
  github: 'fab fa-github',
  other: 'fas fa-link',
};

const SocialMediaLinkManagement = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: 'facebook', url: '', icon_class: 'fab fa-facebook-f', is_active: true, order: 0 });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchLinks = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/social-media-links/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: 'facebook', url: '', icon_class: 'fab fa-facebook-f', is_active: true, order: 0 });
    setShowForm(true);
  };

  const openEdit = (link) => {
    setEditing(link);
    setFormData({ name: link.name || 'facebook', url: link.url || '', icon_class: link.icon_class || 'fab fa-facebook-f', is_active: link.is_active !== undefined ? link.is_active : true, order: link.order || 0 });
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); setFormData({ name: 'facebook', url: '', icon_class: 'fab fa-facebook-f', is_active: true, order: 0 }); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.patch(`${API_BASE_URL}/users/social-media-links/${editing.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/social-media-links/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchLinks();
      showNotification(editing ? 'Link updated successfully.' : 'Link created successfully.', 'success');
      closeForm();
    } catch (err) { console.error(err);       showNotification('Failed to save link.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/social-media-links/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setLinks(links.filter(l => l.id !== id));
      showNotification('Link deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete link.', 'error'); }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Social Media Links</h1>
        <div className="flex gap-3">
          <button onClick={fetchLinks} className="bg-gray-700 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-600 transition-colors">Refresh</button>
          <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ New Link</button>
        </div>
      </div>
      {showForm && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">{editing ? 'Edit Link' : 'New Link'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Platform</label>
                <select name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value, icon_class: PLATFORM_ICONS[e.target.value] || formData.icon_class})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="github">GitHub</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Order</label>
                <input type="number" name="order" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">URL *</label>
              <input type="url" name="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Icon Class</label>
              <input type="text" name="icon_class" value={formData.icon_class} onChange={(e) => setFormData({...formData, icon_class: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              Active
            </label>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={closeForm} className="bg-gray-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-4">
        {links.map((link) => (
          <div key={link.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold capitalize">{link.name}</h3>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 text-sm hover:underline">{link.url}</a>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(link)} className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-400">Edit</button>
              <button onClick={() => handleDelete(link.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaLinkManagement;
