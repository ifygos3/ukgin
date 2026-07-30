import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentCenter = () => {
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeCat, setActiveCat] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, docRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/users/public/document-categories/'),
          axios.get('http://127.0.0.1:8000/users/public/documents/'),
        ]);
        setCategories(catRes.data.results || catRes.data);
        setDocuments(docRes.data.results || docRes.data);
      } catch {
        setCategories([{ name: 'All' }, { name: 'Legal' }, { name: 'Forms' }, { name: 'Reports' }, { name: 'Minutes' }, { name: 'Policies' }, { name: 'Certificates' }, { name: 'Publications' }, { name: 'Receipts' }]);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCat === 'All' ? documents : documents.filter(d => d.category?.name === activeCat);

  const openFile = (doc) => {
    if (doc.file_url) window.open(doc.file_url, '_blank');
    else alert('Document unavailable at the moment.');
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Document Center</h1>
      <p className='text-gray-300 text-lg mb-8'>Access official UKGIN documents, receipts, reports, and publications.</p>

      <div className='flex flex-wrap gap-2 mb-8'>
        {['All', ...categories.map(c => c.name)].filter(Boolean).map(c => (
          <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeCat === c ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div className='text-center text-gray-400'>Loading documents...</div>
      ) : (
        <div className='space-y-3'>
          {filtered.map((d, i) => (
            <div key={i} className='bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center hover:border-yellow-400/30 transition cursor-pointer' onClick={() => openFile(d)}>
              <div className='flex items-center gap-4'>
                <div className='text-3xl'>{d.is_receipt ? '🧾' : '📄'}</div>
                <div>
                  <span className='text-white font-bold block'>{d.title}</span>
                  <span className='text-gray-500 text-sm'>{d.description || d.category?.name || 'General'}</span>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <span className='bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs'>{d.category?.name}</span>
                <span className='text-yellow-400 text-sm font-bold hover:text-yellow-300'>Download</span>
              </div>
            </div>
          ))}
          {!loading && filtered.length === 0 && <p className='text-gray-400 text-center'>No documents found in this category.</p>}
        </div>
      )}
    </div>
  );
};

export default DocumentCenter;
