import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Constitution = () => {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConstitution = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/constitution/`);
        const data = res.data.results || res.data;
        setConstitution(Array.isArray(data) ? data[0] : data);
      } catch {
        setConstitution({
          version: '3.0',
          title: 'Constitution of the United Kingdom of Great Igbo Nation (UKGIN)',
          content: 'The constitution is not currently available online.',
          file: null,
          is_current: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConstitution();
  }, []);

  const handleDownload = async () => {
    const rawFileUrl = constitution?.file_url || constitution?.file;
    const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);
    if (fileUrl) {
      try {
        const response = await axios.get(fileUrl, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `UKGIN-Constitution-v${constitution?.version || '3.0'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.open(fileUrl, '_blank');
      }
    } else {
      const content = constitution?.content || 'UKGIN Constitution content not available.';
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UKGIN-Constitution-v${constitution?.version || '3.0'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const readerContent = constitution?.content || 'The constitution content is not currently available. Please check back soon.';

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Constitution of UKGIN</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 space-y-4">
              <Skeleton className="w-16 h-16 mx-auto" />
              <Skeleton variant="text" className="w-1/2 mx-auto" />
              <Skeleton variant="text" className="w-full" />
              <Skeleton className="w-32 h-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">Constitution of UKGIN</h1>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl">View or download the official constitution of United Kingdom of Great Igbo Nation.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 text-center hover:border-yellow-400/40 transition">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold text-white mb-4">Read Online</h2>
            <p className="text-gray-400 text-sm mb-6 leading-6">Read the full constitution with search and navigation tools.</p>
            <Link to="/constitution/reader" state={{ content: readerContent, title: constitution?.title || 'Constitution of UKGIN', version: constitution?.version || '3.0' }} className="inline-block bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              View Full Constitution
            </Link>
          </div>
          <div className="bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 text-center hover:border-yellow-400/40 transition">
            <div className="text-6xl mb-4">⬇️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Download</h2>
            <p className="text-gray-400 text-sm mb-6 leading-6">Download the constitution for offline reading and reference.</p>
            <button onClick={handleDownload} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
              Download Constitution
            </button>
          </div>
        </div>

        {constitution && (
          <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 mb-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Constitution Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Title</span><span className="text-white text-right">{constitution.title || 'UKGIN Constitution'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Version</span><span className="text-white">{constitution.version || '3.0'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Effective Date</span><span className="text-white">{constitution.effective_date ? new Date(constitution.effective_date).toLocaleDateString() : 'July 2026'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400">{constitution.is_current ? 'Current' : 'Archived'}</span></div>
            </div>
          </div>
        )}

        <div className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Version History</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-300">Version 3.0</span><span className="text-gray-500">July 2026</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-300">Version 2.0</span><span className="text-gray-500">January 2025</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-300">Version 1.0</span><span className="text-gray-500">June 2020</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Constitution;
