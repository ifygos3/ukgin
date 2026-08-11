import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const initialState = { state: '', coordinator: '', email: '', phone: '', address: '', description: '', is_active: true, order: 0 };

const StateChapterManagement = () => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchChapters = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/state-chapters/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChapters(res.data.results || res.data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load state chapters.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showNotification]);

  useEffect(() => { Promise.resolve().then(() => fetchChapters()); }, [fetchChapters]);

  const openCreate = () => {
    setEditing(null);
    setFormData(initialState);
  };

  const openEdit = (chapter) => {
    setEditing(chapter);
    setFormData({
      state: chapter.state || '',
      coordinator: chapter.coordinator || '',
      email: chapter.email || '',
      phone: chapter.phone || '',
      address: chapter.address || '',
      description: chapter.description || '',
      is_active: chapter.is_active !== undefined ? chapter.is_active : true,
      order: chapter.order || 0,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setFormData(initialState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.patch(`${API_BASE_URL}/users/state-chapters/${editing.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        showNotification('State chapter updated successfully.', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users/state-chapters/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        showNotification('State chapter created successfully.', 'success');
      }
      fetchChapters();
      setTimeout(() => closeForm(), 1500);
    } catch (err) {
      console.error(err);
      showNotification(err?.response?.data?.detail || 'Failed to save state chapter.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this state chapter?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/state-chapters/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setChapters(chapters.filter(c => c.id !== id));
      showNotification('State chapter deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete state chapter.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">State Chapters</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ New Chapter</button>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editing ? 'Edit Chapter' : 'New Chapter'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">State *</label>
              <input type="text" name="state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Coordinator *</label>
              <input type="text" name="coordinator" value={formData.coordinator} onChange={(e) => setFormData({...formData, coordinator: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Order</label>
              <input type="number" name="order" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
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

      <div className="w-full overflow-x-auto overscroll-x-contain border border-gray-800 rounded-xl" style={{WebkitOverflowScrolling: 'touch', touchAction: 'pan-x'}}>
        <div className="min-w-[720px] w-full">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{tableLayout: 'fixed'}}>
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/30">
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">#</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">State</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Coordinator</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Email</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Phone</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Members</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Active</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Order</th>
                <th className="text-right p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-400 text-sm">No state chapters found.</td>
                </tr>
              ) : (
                chapters.map((chapter, i) => (
                  <tr key={chapter.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="p-2 sm:p-3 text-gray-500 text-xs sm:text-sm whitespace-nowrap">{i + 1}</td>
                    <td className="p-2 sm:p-3 text-white font-medium text-xs sm:text-sm whitespace-nowrap">{chapter.state || '—'}</td>
                    <td className="p-2 sm:p-3 text-gray-300 text-xs sm:text-sm whitespace-nowrap">{chapter.coordinator || '—'}</td>
                    <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{chapter.email || '—'}</td>
                    <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{chapter.phone || '—'}</td>
                    <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{chapter.members != null ? chapter.members : 0}</td>
                    <td className="p-2 sm:p-3 whitespace-nowrap">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${chapter.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{chapter.is_active ? 'Yes' : 'No'}</span>
                    </td>
                    <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{chapter.order}</td>
                    <td className="p-2 sm:p-3">
                      <div className="flex justify-end gap-1.5 sm:gap-2">
                        <button onClick={() => openEdit(chapter)} className="bg-yellow-500 text-black px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-yellow-400 min-h-[32px] sm:min-h-[36px]">Edit</button>
                        <button onClick={() => handleDelete(chapter.id)} className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-500 min-h-[32px] sm:min-h-[36px]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StateChapterManagement;
