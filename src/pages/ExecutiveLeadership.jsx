import React, { useState } from 'react';

const ExecutiveLeadership = () => {
  const [search, setSearch] = useState('');
  const leaders = [
    { name: 'Dr. Chukwuemeka Eze', position: 'National President', bio: 'Visionary leader with 20+ years of community service and advocacy.', years: '2020-present', email: 'president@ukgin.org' },
    { name: 'Ngozi Okonkwo', position: 'National Vice President', bio: 'Champion of women empowerment and youth development across Africa.', years: '2020-present', email: 'vice@ukgin.org' },
    { name: 'Emeka Obi', position: 'National Secretary', bio: 'Dedicated administrator and community organizer with extensive experience.', years: '2021-present', email: 'secretary@ukgin.org' },
    { name: 'Adaeze Nwosu', position: 'National Treasurer', bio: 'Financial expert committed to transparency and organizational growth.', years: '2020-present', email: 'treasurer@ukgin.org' },
    { name: 'Chidi Okafor', position: 'State Coordinator - Lagos', bio: 'Passionate about community development and youth mentorship.', years: '2021-present', email: 'lagos@ukgin.org' },
    { name: 'Ngozi Eze', position: 'State Coordinator - Anambra', bio: 'Cultural preservationist and education advocate.', years: '2022-present', email: 'anambra@ukgin.org' },
    { name: 'Emeka Nwosu', position: 'State Coordinator - Rivers', bio: 'Community builder focused on economic empowerment.', years: '2022-present', email: 'rivers@ukgin.org' },
    { name: 'Adaeze Okonkwo', position: 'State Coordinator - FCT', bio: 'Dedicated to expanding UKGIN presence in the capital.', years: '2023-present', email: 'fct@ukgin.org' },
  ];

  const filtered = leaders.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Executive Leadership</h1>
      <p className='text-gray-300 text-lg mb-8'>Our dedicated team of leaders driving UKGIN forward.</p>
      <div className='mb-8'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search leaders by name or position...'
          className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white'
        />
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {filtered.map((l, i) => (
          <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition'>
            <div className='w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl'>👤</div>
            <h3 className='text-white font-bold text-center'>{l.name}</h3>
            <p className='text-yellow-400 text-sm text-center mb-2'>{l.position}</p>
            <p className='text-gray-400 text-sm text-center mb-3'>{l.bio}</p>
            <div className='text-center text-xs text-gray-500 space-y-1'>
              <p>Years: {l.years}</p>
              <p>{l.email}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className='text-gray-400 text-center'>No leaders found matching your search.</p>}
    </div>
  );
};

export default ExecutiveLeadership;