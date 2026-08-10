import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const StateChapters = () => {
  const { isAdmin } = useAuth();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/state-chapters/`);
        setChapters(res.data || []);
      } catch {
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  const fetchMembers = async (state) => {
    if (!isAdmin) return;
    setLoadingMembers(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/public/state-chapters/${encodeURIComponent(state)}/members/`);
      setMembers(res.data || []);
    } catch {
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChapterClick = (chapter) => {
    setSelected(chapter);
    setMembers([]);
    fetchMembers(chapter.state);
  };

  if (loading) {
    return (
      <div className='min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white'>
        <h1 className='text-5xl font-bold text-yellow-400 mb-6'>State Chapters</h1>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-3'>
              <Skeleton className='w-1/2 h-6' />
              <Skeleton className='w-full h-4' />
              <Skeleton className='w-3/4 h-4' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-5xl font-bold text-yellow-400 mb-6'>State Chapters</h1>
        <p className='text-gray-300 text-lg mb-8'>Browse our state chapters, meet the coordinators, and get involved locally.</p>

        {chapters.length === 0 ? (
          <EmptyState icon="📍" title="No State Chapters Available" description="There are currently no state chapters listed. Please check back later." />
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {chapters.map((ch) => (
              <div key={ch.id || ch.state} onClick={() => handleChapterClick(ch)} className='bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition cursor-pointer'>
                <h3 className='text-white font-bold text-xl mb-1'>{ch.state} State</h3>
                <p className='text-yellow-400 text-sm mb-3'>Coordinator: {ch.coordinator || '—'}</p>
                <p className='text-gray-400 text-sm mb-4 leading-6'>{ch.description || 'No description available.'}</p>
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Est. {ch.established || '—'}</span>
                  {isAdmin && <span>Members: {ch.members != null ? ch.members : 0}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && isAdmin && (
          <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6' onClick={() => { setSelected(null); setMembers([]); }}>
            <div className='bg-gray-900 p-8 rounded-3xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
              <div className='flex justify-between items-start mb-4'>
                <div>
                  <h3 className='text-2xl font-bold text-yellow-400'>{selected.state} State Chapter</h3>
                  <p className='text-gray-400 text-sm'>Est. {selected.established || '—'} • Members: {selected.members != null ? selected.members : 0}</p>
                </div>
                <button onClick={() => { setSelected(null); setMembers([]); }} className='text-gray-400 hover:text-white text-xl'>✕</button>
              </div>
              <p className='text-gray-300 mb-6 leading-7'>{selected.description || 'No description available.'}</p>
              <div className='space-y-2 text-sm mb-6'>
                <p><span className='text-gray-400'>Coordinator:</span> <span className='text-white'>{selected.coordinator || '—'}</span></p>
                <p><span className='text-gray-400'>Email:</span> <span className='text-white'>{selected.email || '—'}</span></p>
                <p><span className='text-gray-400'>Phone:</span> <span className='text-white'>{selected.phone || '—'}</span></p>
                <p><span className='text-gray-400'>Address:</span> <span className='text-white'>{selected.address || '—'}</span></p>
              </div>
              <h4 className='text-lg font-bold text-yellow-400 mb-4'>Members ({members.length})</h4>
              {loadingMembers ? (
                <p className='text-gray-400 text-sm'>Loading members...</p>
              ) : members.length > 0 ? (
                <div className='overflow-x-auto mb-6 border border-gray-800 rounded-xl'>
                  <details className='group'>
                    <summary className='p-3 text-yellow-400 font-bold cursor-pointer hover:text-yellow-300 transition-colors'>Member List</summary>
                    <table className='w-full text-sm'>
                      <thead>
                        <tr className='border-b border-gray-800'>
                          <th className='text-left p-2 text-gray-400'>Name</th>
                          <th className='text-left p-2 text-gray-400'>Email</th>
                          <th className='text-left p-2 text-gray-400'>Role</th>
                          <th className='text-left p-2 text-gray-400'>KYC</th>
                          <th className='text-left p-2 text-gray-400'>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => (
                          <tr key={m.id} className='border-b border-gray-800/50 hover:bg-gray-800/30'>
                            <td className='p-2 text-white'>{m.full_name || m.username}</td>
                            <td className='p-2 text-gray-400'>{m.email}</td>
                            <td className='p-2'>
                              <span className={`px-2 py-1 rounded text-sm ${m.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-300' : m.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : m.role === 'finance_manager' ? 'bg-green-500/20 text-green-300' : m.role === 'support_staff' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>{m.role}</span>
                            </td>
                            <td className='p-2'><span className={`px-2 py-1 rounded text-sm ${m.kyc_status === 'approved' ? 'bg-green-500/20 text-green-300' : m.kyc_status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{m.kyc_status}</span></td>
                            <td className='p-2 text-gray-500 text-sm'>{new Date(m.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </div>
              ) : (
                <p className='text-gray-500 text-sm mb-6'>No members found for this chapter.</p>
              )}
              <div className='flex flex-col sm:flex-row gap-3'>
                <Link to='/volunteer' className='bg-yellow-500 text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-yellow-400 transition text-center'>Get Involved</Link>
                <button onClick={() => { if (selected.email) window.location.href = `mailto:${selected.email}`; }} className='bg-gray-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-600 transition'>Contact Coordinator</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StateChapters;
