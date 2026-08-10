import { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/sponsors/`);
        setSponsors(res.data || []);
      } catch {
        setSponsors([
          { name: 'Sponsor A', tier: 'Gold' },
          { name: 'Sponsor B', tier: 'Gold' },
          { name: 'Sponsor C', tier: 'Silver' },
          { name: 'Sponsor D', tier: 'Silver' },
          { name: 'Sponsor E', tier: 'Bronze' },
          { name: 'Sponsor F', tier: 'Bronze' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Our Sponsors</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-3">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton variant="text" className="w-3/4 mx-auto" />
              <Skeleton variant="text" className="w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const tierColors = { Gold: 'text-yellow-400', Silver: 'text-gray-300', Bronze: 'text-orange-400' };
  const tierBg = { Gold: 'bg-yellow-400/10 border-yellow-400/20', Silver: 'bg-gray-400/10 border-gray-400/20', Bronze: 'bg-orange-400/10 border-orange-400/20' };

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Our Sponsors</h1>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl">Organizations and individuals who sponsor our events and programs.</p>
        {sponsors.length === 0 ? (
          <EmptyState icon="🏅" title="No sponsors yet" description="Check back soon for our sponsor listings." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((s, i) => (
              <div key={i} className={`bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border text-center hover:border-yellow-400/30 transition group ${tierBg[s.tier] || 'border-gray-800'}`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🏅</div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-yellow-400 transition-colors">{s.name}</h3>
                <span className={`text-sm font-bold ${tierColors[s.tier] || 'text-gray-400'}`}>{s.tier || 'Sponsor'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sponsors;
