import { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const EXECUTIVE_DEFAULT = [
  { name: 'Queen Pat Ukachi Levison Ekeogu', position: 'President General/Founder', bio: 'Visionary leader with 20+ years of community service and advocacy for Igbo unity worldwide.', years: '2020-present', email: 'president@ukgin.org' },
  { name: 'Ofochi Benjamin Atagana (Esq.)', position: 'National President', bio: 'Legal expert and community advocate with extensive experience in Igbo diaspora affairs.', years: '2024-present', email: 'national.president@ukgin.org' },
  { name: 'Asiegbu Uloma', position: 'Vice National President', bio: 'Dedicated leader focused on youth empowerment and community development initiatives.', years: '2024-present', email: 'vice.president@ukgin.org' },
  { name: 'Mozo Nonso', position: 'Board Chairman', bio: 'Seasoned administrator and financial expert with a strong commitment to organizational governance and growth.', years: '2020-present', email: 'board.chairman@ukgin.org' },
];

const ExecutiveLeadership = () => {
  const [search, setSearch] = useState('');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/executive-leaders/`);
        setLeaders(res.data && res.data.length > 0 ? res.data : EXECUTIVE_DEFAULT);
      } catch {
        setLeaders(EXECUTIVE_DEFAULT);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const filtered = leaders.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.position.toLowerCase().includes(search.toLowerCase())
  );

  const activeLeaders = filtered.filter(l => l.is_active === undefined || l.is_active !== false);
  const pastLeaders = filtered.filter(l => l.is_active === false);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Executive Leadership</h1>
        <p className="text-gray-400">Loading leadership...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">Executive Leadership</h1>
        <p className="text-gray-300 text-lg mb-8">Our dedicated team of leaders driving UKGIN forward.</p>

        <div className="mb-8 max-w-xl">
          <label htmlFor="leader-search" className="sr-only">Search leaders</label>
          <input
            id="leader-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaders by name or position..."
            className="w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
          />
        </div>

        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Current Leaders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeLeaders.length === 0 ? (
            <EmptyState icon="👥" title="No leaders found" description="Try adjusting your search." />
          ) : (
            activeLeaders.map((l, i) => (
              <div key={l.id || i} className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition text-center">
                {l.photo_url ? (
                  <img src={l.photo_url} alt={l.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" loading="lazy" />
                ) : (
                  <div className="w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
                )}
                <h3 className="text-white font-bold text-lg mb-1">{l.name}</h3>
                <p className="text-yellow-400 text-sm mb-2">{l.position}</p>
                <p className="text-gray-400 text-sm mb-3 leading-6">{l.bio}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Years: {l.years_in_office || '—'}</p>
                  {l.email && <p>Email: {l.email}</p>}
                </div>
              </div>
            ))
          )}
        </div>

        {pastLeaders.length > 0 && (
          <div className='mt-12'>
            <h2 className='text-2xl font-bold text-gray-400 mb-4'>Past Leaders</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {pastLeaders.map((l, i) => (
                <div key={l.id || i} className='bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 text-center opacity-70'>
                  {l.photo_url ? (
                    <img src={l.photo_url} alt={l.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover grayscale" loading="lazy" />
                  ) : (
                    <div className='w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl grayscale'>👤</div>
                  )}
                  <h3 className='text-white font-bold text-lg mb-1'>{l.name}</h3>
                  <p className='text-gray-400 text-sm mb-2'>{l.position}</p>
                  <p className='text-gray-500 text-sm mb-3 leading-6'>{l.bio}</p>
                  <div className='text-sm text-gray-600 space-y-1'>
                    <p>Years: {l.years_in_office || '—'}</p>
                    {l.email && <p>Email: {l.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveLeadership;
