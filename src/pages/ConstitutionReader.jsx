import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ConstitutionReader = () => {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const fetchConstitution = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/constitution/`);
        const data = res.data.results || res.data;
        const c = Array.isArray(data) ? data[0] : data;
        if (c) {
          setConstitution(c);
        }
      } catch {
        setConstitution(null);
      } finally {
        setLoading(false);
      }
    };
    fetchConstitution();
  }, []);

  const constitutionText = constitution?.content || '';
  const lines = constitutionText.split('\n');
  const [query, setQuery] = useState('');
  const rawFileUrl = constitution?.file_url || constitution?.file;
  const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);

  const filteredLines = query
    ? lines.filter((line) => {
        const terms = query.toLowerCase().split(' ').filter(Boolean);
        const haystack = line.toLowerCase();
        return terms.every((t) => haystack.includes(t));
      })
    : lines;

  const handleDownload = async () => {
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
      const blob = new Blob([constitutionText], { type: 'text/plain' });
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

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="w-64 h-10 mb-6" />
          <Skeleton className="w-full h-12 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} variant="text" className="w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!constitution) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-6">Constitution Not Available</h1>
          <p className="text-gray-300 mb-6">The constitution content is not currently available. Please check back soon.</p>
          <Link to="/constitution" className="text-yellow-400 hover:text-yellow-300">Back to Constitution</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">{constitution.title || 'Constitution of UKGIN'}</h1>
            <p className="text-gray-400 mt-1">Read the full constitution online with search and navigation.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/constitution" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors">Back</Link>
            <button onClick={handleDownload} className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors">
              {fileUrl ? 'Download PDF' : 'Download'}
            </button>
          </div>
        </div>

        {fileUrl && !pdfError && (
          <div className="mb-6 rounded-2xl border border-gray-800 overflow-hidden" style={{ height: '75vh' }}>
            <iframe src={fileUrl} title="Constitution PDF" className="w-full h-full" onError={() => setPdfError(true)} />
          </div>
        )}

        {(pdfError || !fileUrl) && (
          <>
            <div className="mb-6">
              <label htmlFor="constitution-search" className="sr-only">Search constitution</label>
              <input id="constitution-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search constitution..." className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
              <p className="text-gray-500 text-xs mt-2">{query ? `${filteredLines.length} match${filteredLines.length === 1 ? '' : 'es'} found` : 'Showing full constitution'}</p>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-gray-800">
              {filteredLines.map((line, idx) => {
                const isHeading = /^(CHAPTER|PRE|SCHEDULE|\d+\.\d)/.test(line.trim());
                return (
                  <div
                    key={idx}
                    className={`py-2 px-3 rounded-lg transition cursor-text ${isHeading ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}
                  >
                    {line || '\u00A0'}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConstitutionReader;
