import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const HEADING_CLASSES = {
  1: 'text-3xl md:text-4xl font-extrabold text-yellow-400 mt-2 mb-4',
  2: 'text-2xl md:text-3xl font-extrabold text-yellow-400 mt-8 mb-3',
  3: 'text-xl font-bold text-yellow-300 mt-6 mb-2',
  4: 'text-lg font-bold text-yellow-200 mt-5 mb-2',
};

const isListItem = (line) => /^\s*([-*+]|\d+[.)])\s+/.test(line);

const isUpperHeading = (line) => {
  const t = line.trim();
  return t.length > 4 && t === t.toUpperCase() && /[A-Z]/.test(t) && !isListItem(t);
};

const parseBlocks = (text) => {
  const blocks = [];
  for (const chunk of text.split(/\r?\n\s*\r?\n/)) {
    const lines = chunk.split(/\r?\n/).filter((l) => l.trim() !== '');
    if (!lines.length) continue;
    if (lines.every((l) => /^#{1,4}\s+/.test(l))) {
      const level = Math.min(4, lines[0].match(/^#+/)[0].length);
      blocks.push({ type: 'heading', level, lines: lines.map((l) => l.replace(/^#{1,4}\s+/, '')) });
    } else if (lines.every(isUpperHeading)) {
      blocks.push({ type: 'heading', level: 3, lines });
    } else if (lines.every(isListItem)) {
      blocks.push({ type: 'list', lines });
    } else {
      blocks.push({ type: 'paragraph', lines: [lines.join(' ')] });
    }
  }
  return blocks;
};

const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i} className="text-gray-200 italic">{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
};

const ConstitutionReader = () => {
  const [constitution, setConstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [viewMode, setViewMode] = useState('pdf');

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
  const hasText = constitutionText.trim().length > 0;
  const [query, setQuery] = useState('');
  const rawFileUrl = constitution?.file_url || constitution?.file;
  const fileUrl = rawFileUrl && (rawFileUrl.startsWith('http://') || rawFileUrl.startsWith('https://')) ? rawFileUrl : (rawFileUrl ? `${API_BASE_URL}${rawFileUrl}` : null);

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = (line) => terms.every((t) => line.toLowerCase().includes(t));
  const visibleBlocks = parseBlocks(constitutionText)
    .map((block) => (terms.length ? { ...block, lines: block.lines.filter(matches) } : block))
    .filter((block) => block.lines.length > 0);
  const matchCount = visibleBlocks.reduce((total, block) => total + block.lines.length, 0);

  const handleDownload = async () => {
    if (fileUrl) {
      const downloadUrl = `${fileUrl}${fileUrl.includes('?') ? '&' : '?'}download=1`;
      try {
        const response = await axios.get(downloadUrl, { responseType: 'blob' });
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
        window.open(downloadUrl, '_blank');
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

        {fileUrl && hasText && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${viewMode === 'pdf' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Read PDF
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${viewMode === 'text' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Read Text
            </button>
          </div>
        )}

        {fileUrl && !pdfError && viewMode === 'pdf' && (
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                The PDF is displayed below. If the frame stays blank, open it directly or download a copy.
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => window.open(fileUrl, '_blank')} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 transition-colors">
                  Open in new tab
                </button>
                <button type="button" onClick={handleDownload} className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-yellow-400 transition-colors">
                  Download PDF
                </button>
              </div>
            </div>
            <object data={fileUrl} type="application/pdf" className="w-full rounded-2xl border border-gray-800" style={{ height: '75vh' }}>
              <iframe src={fileUrl} title="Constitution PDF" className="w-full h-full" onError={() => setPdfError(true)} />
            </object>
          </div>
        )}

        {((!fileUrl || pdfError || viewMode === 'text') && hasText) && (
          <>
            <div className="mb-6">
              <label htmlFor="constitution-search" className="sr-only">Search constitution</label>
              <input id="constitution-search" type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search constitution..." className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors" />
              <p className="text-gray-500 text-xs mt-2">{query ? `${matchCount} line${matchCount === 1 ? '' : 's'} found` : 'Showing full constitution'}</p>
            </div>

            <article className="bg-gray-900/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl border border-gray-800">
              {visibleBlocks.map((block, idx) => {
                if (block.type === 'heading') {
                  const Tag = `h${block.level}`;
                  return (
                    <Tag key={idx} className={HEADING_CLASSES[block.level] || HEADING_CLASSES[4]}>
                      {renderInline(block.lines.join(' '))}
                    </Tag>
                  );
                }
                if (block.type === 'list') {
                  return (
                    <ul key={idx} className="list-disc pl-6 mb-4 space-y-1.5 text-gray-300 leading-relaxed">
                      {block.lines.map((line, i) => (
                        <li key={i}>{renderInline(line.replace(/^\s*([-*+]|\d+[.)])\s+/, ''))}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={idx} className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                    {renderInline(block.lines.join(' '))}
                  </p>
                );
              })}
              {visibleBlocks.length === 0 && (
                <p className="text-gray-400 text-center py-8">No sections match your search.</p>
              )}
            </article>
          </>
        )}
      </div>
    </div>
  );
};

export default ConstitutionReader;
