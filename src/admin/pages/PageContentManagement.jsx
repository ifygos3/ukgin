import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PAGE_TYPES = [
  { value: 'about', label: 'About Us' },
  { value: 'organizational_structure', label: 'Organizational Structure' },
  { value: 'state_chapters', label: 'State Chapters' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'executive_leadership', label: 'Executive Leadership' },
  { value: 'constitution', label: 'Constitution' },
  { value: 'refund_policy', label: 'Refund Policy' },
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'terms_conditions', label: 'Terms & Conditions' },
  { value: 'cookie_policy', label: 'Cookie Policy' },
];

const PageContentManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({ slug: '', page_type: '', title: '', content: '', is_published: true });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchPages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/pages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPages(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const openCreate = () => {
    setEditingPage(null);
    setFormData({ slug: '', page_type: '', title: '', content: '', is_published: true });
  };

  const openEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug || '',
      page_type: page.page_type || '',
      title: page.title || '',
      content: page.content || '',
      is_published: page.is_published || false,
    });
  };

  const closeForm = () => {
    setEditingPage(null);
    setFormData({ slug: '', page_type: '', title: '', content: '', is_published: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPage) {
        await axios.patch(`${API_BASE_URL}/users/pages/${editingPage.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/pages/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchPages();
      showNotification(editingPage ? 'Page content updated successfully.' : 'Page content created successfully.', 'success');
      closeForm();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save page content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this page content?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/pages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPages(pages.filter((page) => page.id !== id));
      showNotification('Page content deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete page content.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Page Content</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          + New Page
        </button>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingPage ? 'Edit Page Content' : 'Create New Page Content'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Page Type</label>
            <select name="page_type" value={formData.page_type} onChange={handleChange} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
              <option value="">Select Page Type</option>
              {PAGE_TYPES.map((page) => (
                <option key={page.value} value={page.value}>{page.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="8" required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
            Published
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">
              {saving ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-[640px] sm:min-w-0 align-middle">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Title</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Page Slug</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Page Type</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Published</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Updated</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{page.id}</td>
                  <td className="p-2 sm:p-3 text-white font-bold text-xs sm:text-sm whitespace-nowrap">{page.title}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{page.slug}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{page.page_type}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{page.is_published ? <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Yes</span> : <span className="bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">No</span>}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(page.updated_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      <button onClick={() => openEdit(page)} className="text-blue-400 hover:text-blue-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">Edit</button>
                      <button onClick={() => handleDelete(page.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && pages.length === 0 && (
        <p className="text-gray-400 text-center py-8">No page content records found.</p>
      )}
    </div>
  );
};

export default PageContentManagement;
