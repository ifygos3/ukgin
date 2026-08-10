import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PartnersSponsorsManagement = () => {
  const [partners, setPartners] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('partners');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', website: '', description: '', tier: 'bronze', is_active: true, order: 0 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchData = useCallback(async () => {
    try {
      const partnersRes = await axios.get(`${API_BASE_URL}/users/partners/`, { headers: { Authorization: `Bearer ${token}` } });
      setPartners(partnersRes.data.results || partnersRes.data || []);
    } catch (err) {
      console.error(err);
      setPartners([]);
    }
    try {
      const sponsorsRes = await axios.get(`${API_BASE_URL}/users/sponsors/`, { headers: { Authorization: `Bearer ${token}` } });
      setSponsors(sponsorsRes.data.results || sponsorsRes.data || []);
    } catch (err) {
      console.error(err);
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ name: '', website: '', description: '', tier: 'bronze', is_active: true, order: 0 });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      website: item.website || '',
      description: item.description || '',
      tier: item.tier || 'bronze',
      is_active: item.is_active !== undefined ? item.is_active : true,
      order: item.order || 0,
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('website', formData.website || '');
      payload.append('description', formData.description || '');
      payload.append('tier', formData.tier);
      payload.append('is_active', formData.is_active);
      payload.append('order', formData.order);
      if (selectedFile) {
        payload.append('logo', selectedFile);
      }

      const endpoint = activeTab === 'partners' ? 'partners' : 'sponsors';

      if (editingItem) {
        await axios.patch(`${API_BASE_URL}/users/${endpoint}/${editingItem.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        showNotification(`${activeTab === 'partners' ? 'Partner' : 'Sponsor'} updated successfully.`, 'success');
      } else {
        await axios.post(`${API_BASE_URL}/users/${endpoint}/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        showNotification(`${activeTab === 'partners' ? 'Partner' : 'Sponsor'} created successfully.`, 'success');
      }
      fetchData();
      closeForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || 'Failed to save.';
      showNotification(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const endpoint = activeTab === 'partners' ? 'partners' : 'sponsors';
      await axios.delete(`${API_BASE_URL}/users/${endpoint}/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      showNotification(`${activeTab === 'partners' ? 'Partner' : 'Sponsor'} deleted successfully.`, 'success');
      fetchData();
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete item.', 'error');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const currentItems = activeTab === 'partners' ? partners : sponsors;
  const TIER_COLORS = {
    platinum: 'bg-yellow-500/20 text-yellow-300',
    gold: 'bg-yellow-400/20 text-yellow-300',
    silver: 'bg-gray-300/20 text-gray-300',
    bronze: 'bg-orange-500/20 text-orange-300',
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Partners & Sponsors</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ Add New</button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <button onClick={() => setActiveTab('partners')} className={`px-4 py-2 font-bold text-sm transition ${activeTab === 'partners' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-300'}`}>Partners</button>
        <button onClick={() => setActiveTab('sponsors')} className={`px-4 py-2 font-bold text-sm transition ${activeTab === 'sponsors' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400 hover:text-gray-300'}`}>Sponsors</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={closeForm}>
          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">{editingItem ? 'Edit' : 'Add'} {activeTab === 'partners' ? 'Partner' : 'Sponsor'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Website</label>
                <input type="url" name="website" value={formData.website} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows="3" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
              </div>
              {activeTab === 'sponsors' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tier</label>
                  <select name="tier" value={formData.tier} onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
                    <option value="platinum">Platinum</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Logo</label>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
                {previewUrl && (
                  <img src={previewUrl} alt="preview" className="mt-2 h-24 object-contain rounded-lg" />
                )}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-300">
                  <input type="checkbox" name="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} /> Active
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentItems.map((item) => (
          <div key={item.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="h-32 bg-gray-800 flex items-center justify-center">
              {item.logo_url ? (
                <img src={item.logo_url} alt={item.name} className="max-h-full max-w-full object-contain p-4" />
              ) : (
                <span className="text-4xl text-gray-600">{activeTab === 'partners' ? '🤝' : '⭐'}</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-bold text-sm truncate">{item.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                {activeTab === 'sponsors' && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${TIER_COLORS[item.tier] || 'bg-gray-500/20 text-gray-300'}`}>{item.tier}</span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.is_active ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{item.is_active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(item)} className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-blue-500">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentItems.length === 0 && (
        <p className="text-gray-400 text-center py-8">No {activeTab} found. Add your first {activeTab === 'partners' ? 'partner' : 'sponsor'}!</p>
      )}
    </div>
  );
};

export default PartnersSponsorsManagement;
