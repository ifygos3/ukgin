import { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const DocumentCenter = () => {
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await axios.get(`${API_BASE_URL}/users/public/document-categories/`);
        setCategories(catRes.data.results || catRes.data);
      } catch {
        setCategories([{ name: 'All' }, { name: 'Legal' }, { name: 'Forms' }, { name: 'Reports' }, { name: 'Minutes' }, { name: 'Policies' }, { name: 'Certificates' }, { name: 'Publications' }, { name: 'Receipts' }]);
      }
      try {
        const docRes = await axios.get(`${API_BASE_URL}/users/public/documents/`);
        setDocuments(docRes.data.results || docRes.data || []);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCat === 'All' ? documents : documents.filter(d => d.category?.name === activeCat);

  const openFile = (doc) => {
    const rawFileUrl = doc.file_url || doc.file;
    const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);
    if (fileUrl) window.open(fileUrl, '_blank');
    else alert('Document unavailable at the moment.');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Document Center</h1>
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
              <Skeleton className="w-10 h-10 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-1/2" />
                <Skeleton variant="text" className="w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Document Center</h1>
        <p className="text-gray-300 text-lg mb-8">Access official UKGIN documents, receipts, reports, and publications.</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...categories.map(c => c.name)].filter(Boolean).map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeCat === c ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{c}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState icon="📄" title="No documents found" description="There are no documents in this category." />
          ) : (
            filtered.map((d, i) => (
              <div key={i} className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-yellow-400/30 transition cursor-pointer" onClick={() => openFile(d)}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className="text-3xl shrink-0">{d.is_receipt ? '🧾' : '📄'}</div>
                  <div className="min-w-0">
                    <span className="text-white font-bold block truncate">{d.title}</span>
                    <span className="text-gray-500 text-sm">{d.description || d.category?.name || 'General'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {d.category?.name && <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-sm hidden sm:inline">{d.category.name}</span>}
                  <span className="text-yellow-400 text-sm font-bold hover:text-yellow-300 transition-colors">Download</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCenter;
