import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchDocuments = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.set('category', filterCategory);
      const res = await axios.get(`${API_BASE_URL}/users/documents/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, filterCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/document-categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.results || res.data || []);
    } catch {
      setCategories([]);
    }
  }, [token]);

  useEffect(() => { fetchDocuments(); fetchCategories(); }, [fetchDocuments, fetchCategories]);

  const handleDownload = async (doc) => {
    try {
      const rawFileUrl = doc.file_url || (typeof doc.file === 'string' ? doc.file : doc.file?.url);
      const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);
      if (!fileUrl) {
        showNotification('No file available for download.', 'error');
        return;
      }
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.title || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showNotification('Download started.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to download document.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Document Downloads</h1>
        <span className="text-gray-400">{documents.length} documents</span>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6 flex gap-4 items-center">
        <label className="text-sm text-gray-400">Filter by Category:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-black p-2 rounded-xl border border-gray-700 text-white text-sm">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm truncate">{doc.title}</h3>
              <p className="text-gray-400 text-xs truncate">{doc.description || 'No description'}</p>
              <span className="text-gray-500 text-[10px]">{doc.category?.name || 'Uncategorized'} | {doc.is_receipt ? 'Receipt' : 'Document'}</span>
            </div>
            <button onClick={() => handleDownload(doc)} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-xl font-bold text-sm hover:bg-yellow-500 transition-colors flex-shrink-0">
              Download
            </button>
          </div>
        ))}
      </div>

      {documents.length === 0 && (
        <p className="text-gray-400 text-center py-8">No documents found.</p>
      )}
    </div>
  );
};

export default DocumentManagement;
