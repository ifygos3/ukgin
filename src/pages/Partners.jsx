import { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/partners/`);
        setPartners(res.data || []);
      } catch {
        setPartners([
          { name: 'Partner A', description: 'Supporting community development' },
          { name: 'Partner B', description: 'Empowering youth education' },
          { name: 'Partner C', description: 'Cultural preservation initiatives' },
          { name: 'Partner D', description: 'Economic empowerment programs' },
          { name: 'Partner E', description: 'Healthcare and wellness' },
          { name: 'Partner F', description: 'Technology and innovation' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Our Partners</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-3">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton variant="text" className="w-3/4 mx-auto" />
              <Skeleton variant="text" className="w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Our Partners</h1>
        <p className="text-gray-300 text-lg mb-10 max-w-2xl">Organizations and individuals who support our mission and help us create lasting impact.</p>
        {partners.length === 0 ? (
          <EmptyState icon="🤝" title="No partners yet" description="Check back soon for our partner listings." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((p, i) => (
              <div key={i} className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition text-center group">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">🤝</div>
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors">{p.name}</h3>
                <p className="text-gray-400 text-base leading-6">{p.description || 'Strategic partner of UKGIN'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;
