import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ExecutiveLeaderManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', position: '', bio: '', years_in_office: '', email: '', order: 0, is_active: true });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchLeaders = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/executive-leaders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaders(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLeaders(); }, [fetchLeaders]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '', position: '', bio: '', years_in_office: '', email: '', order: 0, is_active: true });
  };

  const openEdit = (leader) => {
    setEditing(leader);
    setFormData({
      name: leader.name || '',
      position: leader.position || '',
      bio: leader.bio || '',
      years_in_office: leader.years_in_office || '',
      email: leader.email || '',
      order: leader.order || 0,
      is_active: leader.is_active !== undefined ? leader.is_active : true,
    });
  };

  const closeForm = () => { setEditing(null); setFormData({ name: '', position: '', bio: '', years_in_office: '', email: '', order: 0, is_active: true }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.patch(`${API_BASE_URL}/users/executive-leaders/${editing.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/executive-leaders/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchLeaders();
      showNotification(editing ? 'Leader updated successfully.' : 'Leader created successfully.', 'success');
      closeForm();
    } catch (err) { console.error(err);       showNotification('Failed to save leader.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leader?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/executive-leaders/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setLeaders(leaders.filter(l => l.id !== id));
      showNotification('Leader deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete leader.', 'error'); }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Executive Leaders</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ New Leader</button>
      </div>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editing ? 'Edit Leader' : 'New Leader'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name *</label>
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Position *</label>
              <input type="text" name="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="3" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Years in Office</label>
              <input type="text" name="years_in_office" value={formData.years_in_office} onChange={(e) => setFormData({...formData, years_in_office: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Order</label>
              <input type="number" name="order" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <label className="flex items-center gap-2 text-gray-300 mt-6">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
              Active
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={closeForm} className="bg-gray-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {leaders.map((leader) => (
          <div key={leader.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold">{leader.name}</h3>
              <p className="text-yellow-400 text-sm">{leader.position}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(leader)} className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-400">Edit</button>
              <button onClick={() => handleDelete(leader.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutiveLeaderManagement;
