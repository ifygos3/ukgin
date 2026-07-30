import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Constitution = () => {
  const [constitution, setConstitution] = useState(null);

  useEffect(() => {
    const fetchConstitution = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/users/public/constitution/');
        const data = res.data.results || res.data;
        setConstitution(Array.isArray(data) ? data[0] : data);
      } catch {
        setConstitution({
          version: '3.0',
          title: 'Constitution of the United Kingdom of Great Igbo Nation (UKGIN)',
          file: null,
          is_current: true,
        });
      }
    };
    fetchConstitution();
  }, []);

  const handleDownload = () => {
    if (constitution?.file) {
      window.open(constitution.file, '_blank');
    } else if (constitution?.content) {
      const blob = new Blob([constitution.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UKGIN-Constitution-v${constitution.version || '3.0'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert('Constitution file is not available. Please try reading online.');
    }
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Constitution of UKGIN</h1>
      <p className='text-gray-300 text-lg mb-8'>View or download the official constitution of United Kingdom of Great Igbo Nation.</p>

      <div className='grid md:grid-cols-2 gap-6 mb-10'>
        <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center'>
          <div className='text-6xl mb-4'>📖</div>
          <h2 className='text-2xl font-bold text-white mb-4'>Read Online</h2>
          <p className='text-gray-400 text-sm mb-6'>Read the full constitution with search and navigation tools.</p>
          <Link to='/constitution/reader' className='inline-block bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition'>
            View Full Constitution
          </Link>
        </div>
        <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 text-center'>
          <div className='text-6xl mb-4'>⬇️</div>
          <h2 className='text-2xl font-bold text-white mb-4'>Download PDF</h2>
          <p className='text-gray-400 text-sm mb-6'>Download the constitution for offline reading and reference.</p>
          <button onClick={handleDownload} className='bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition'>
            Download Constitution
          </button>
        </div>
      </div>

      {constitution && (
        <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
          <h3 className='text-xl font-bold text-yellow-400 mb-4'>Constitution Details</h3>
          <div className='flex justify-between text-sm mb-2'><span className='text-gray-300'>Version</span><span className='text-white'>{constitution.version || '3.0'}</span></div>
          <div className='flex justify-between text-sm mb-2'><span className='text-gray-300'>Effective Date</span><span className='text-white'>{constitution.effective_date ? new Date(constitution.effective_date).toLocaleDateString() : 'July 2026'}</span></div>
          <div className='flex justify-between text-sm'><span className='text-gray-300'>Status</span><span className='text-green-400'>{constitution.is_current ? 'Current' : 'Archived'}</span></div>
        </div>
      )}

      <div className='mt-8 bg-gray-900 p-6 rounded-2xl border border-gray-800'>
        <h3 className='text-xl font-bold text-yellow-400 mb-4'>Version History</h3>
        <div className='space-y-3'>
          <div className='flex justify-between text-sm'><span className='text-gray-300'>Version 3.0</span><span className='text-gray-500'>July 2026</span></div>
          <div className='flex justify-between text-sm'><span className='text-gray-300'>Version 2.0</span><span className='text-gray-500'>January 2025</span></div>
          <div className='flex justify-between text-sm'><span className='text-gray-300'>Version 1.0</span><span className='text-gray-500'>June 2020</span></div>
        </div>
      </div>
    </div>
  );
};

export default Constitution;
