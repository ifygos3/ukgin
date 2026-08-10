import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ConstitutionManagement = () => {
  const [constitutions, setConstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', version: '', content: '', file: null, is_current: false, effective_date: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchConstitutions = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/constitutions/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConstitutions(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchConstitutions(); }, [fetchConstitutions]);

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', version: '', content: '', file: null, is_current: false, effective_date: '' });
  };

  const openEdit = (c) => {
    setEditing(c);
    setFormData({
      title: c.title || '',
      version: c.version || '',
      content: c.content || '',
      file: null,
      is_current: c.is_current || false,
      effective_date: c.effective_date ? c.effective_date.slice(0, 10) : '',
    });
  };

  const closeForm = () => { setEditing(null); setFormData({ title: '', version: '', content: '', file: null, is_current: false, effective_date: '' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('version', formData.version);
      data.append('content', formData.content);
      data.append('is_current', formData.is_current);
      if (formData.effective_date) data.append('effective_date', formData.effective_date);
      if (formData.file) data.append('file', formData.file);
      if (editing) {
        await axios.patch(`${API_BASE_URL}/users/constitutions/${editing.id}/`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/constitutions/`, data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchConstitutions();
      showNotification(editing ? 'Constitution updated successfully.' : 'Constitution uploaded successfully.', 'success');
      closeForm();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save constitution.', 'error');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this constitution?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/constitutions/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setConstitutions(constitutions.filter(c => c.id !== id));
      showNotification('Constitution deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete constitution.', 'error'); }
  };

  const handleDownload = (c) => {
    const rawFileUrl = c.file_url || (typeof c.file === 'string' ? c.file : c.file?.url);
    const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      showNotification('No file attached to this constitution.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Constitution Management</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-yellow-500 transition-colors text-sm sm:text-base whitespace-nowrap">+ New Constitution</button>
      </div>
      <div className="bg-gray-900 p-4 sm:p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">{editing ? 'Edit Constitution' : 'New Constitution'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1 font-medium">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Version *</label>
              <input type="text" name="version" value={formData.version} onChange={(e) => setFormData({...formData, version: e.target.value})} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-medium">Effective Date</label>
              <input type="date" name="effective_date" value={formData.effective_date} onChange={(e) => setFormData({...formData, effective_date: e.target.value})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1 font-medium">Content *</label>
            <textarea name="content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows="8" required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white font-mono focus:border-yellow-400 focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1 font-medium">File {editing ? '(leave empty to keep current)' : '(optional)'}</label>
            <input type="file" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
            {editing && editing.file && (
              <button type="button" onClick={() => handleDownload(editing)} className="mt-2 text-yellow-400 text-sm hover:text-yellow-300 underline">Download current file</button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={saving} className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50 transition-colors">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={closeForm} className="bg-gray-700 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-600 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {constitutions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No constitutions found. Create one above.</p>
        ) : (
          constitutions.map((c) => (
            <div key={c.id} className="bg-gray-900 p-4 sm:p-5 rounded-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg">{c.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm">v{c.version}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.is_current ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>{c.is_current ? 'Current' : 'Archived'}</span>
                  {c.effective_date && <span className="text-gray-500 text-xs">Effective: {new Date(c.effective_date).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {c.file && (
                  <button onClick={() => handleDownload(c)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors">Download</button>
                )}
                <button onClick={() => openEdit(c)} className="bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-500 transition-colors">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConstitutionManagement;
