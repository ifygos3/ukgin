import React from 'react';

const Partners = () => {
  const partners = [
    { name: 'Partner A', desc: 'Supporting community development' },
    { name: 'Partner B', desc: 'Empowering youth education' },
    { name: 'Partner C', desc: 'Cultural preservation initiatives' },
    { name: 'Partner D', desc: 'Economic empowerment programs' },
    { name: 'Partner E', desc: 'Healthcare and wellness' },
    { name: 'Partner F', desc: 'Technology and innovation' },
  ];

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Our Partners</h1>
      <p className='text-gray-300 text-lg mb-8'>Organizations and individuals who support our mission.</p>
      <div className='grid md:grid-cols-3 gap-6'>
        {partners.map((p, i) => (
          <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition text-center'>
            <div className='w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl'>🤝</div>
            <h3 className='text-white font-bold'>{p.name}</h3>
            <p className='text-gray-400 text-sm mt-2'>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partners;