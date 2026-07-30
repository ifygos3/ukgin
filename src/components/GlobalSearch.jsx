import React, { useState, useEffect } from 'react';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Executive Leadership', path: '/executive-leadership' },
    { name: 'Events', path: '/events' },
    { name: 'Blog & News', path: '/blog' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Membership', path: '/signup' },
    { name: 'Donation', path: '/donation' },
    { name: 'Constitution', path: '/constitution' },
    { name: 'Document Center', path: '/documents' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Partners', path: '/partners' },
    { name: 'Sponsors', path: '/sponsors' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  useEffect(() => {
    if (query.length > 0) {
      const filtered = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-20' onClick={onClose}>
      <div className='bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-lg mx-4 overflow-hidden' onClick={e => e.stopPropagation()}>
        <div className='p-4 border-b border-gray-800'>
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search the site...'
            className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none'
            autoFocus
          />
        </div>
        <div className='p-4 max-h-80 overflow-y-auto'>
          {results.length > 0 ? (
            results.map((r, i) => (
              <a key={i} href={r.path} onClick={onClose} className='block p-3 rounded-xl hover:bg-gray-800 transition text-white'>
                {r.name}
              </a>
            ))
          ) : query.length > 0 ? (
            <p className='text-gray-400 text-center py-4'>No results found</p>
          ) : (
            <p className='text-gray-500 text-center py-4'>Start typing to search...</p>
          )}
        </div>
        <div className='p-3 border-t border-gray-800 text-gray-500 text-xs text-center'>
          Press Ctrl+K to open search
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;