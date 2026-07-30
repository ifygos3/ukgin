import React from 'react';

const Sponsors = () => {
  const sponsors = [
    { name: 'Sponsor A', tier: 'Gold' },
    { name: 'Sponsor B', tier: 'Gold' },
    { name: 'Sponsor C', tier: 'Silver' },
    { name: 'Sponsor D', tier: 'Silver' },
    { name: 'Sponsor E', tier: 'Bronze' },
    { name: 'Sponsor F', tier: 'Bronze' },
  ];

  const tierColors = { Gold: 'text-yellow-400', Silver: 'text-gray-300', Bronze: 'text-orange-400' };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Our Sponsors</h1>
      <p className='text-gray-300 text-lg mb-8'>Organizations and individuals who sponsor our events and programs.</p>
      <div className='grid md:grid-cols-3 gap-6'>
        {sponsors.map((s, i) => (
          <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition text-center'>
            <div className='w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl'>🏅</div>
            <h3 className='text-white font-bold'>{s.name}</h3>
            <span className={`text-sm font-bold ${tierColors[s.tier]}`}>{s.tier} Sponsor</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sponsors;