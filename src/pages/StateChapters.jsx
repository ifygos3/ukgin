import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const StateChapters = () => {
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState([]);
  const [memberCounts, setMemberCounts] = useState({});
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchMemberCounts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/state-chapters/`);
        const counts = {};
        res.data.forEach(ch => {
          counts[ch.state] = ch.members || 0;
        });
        setMemberCounts(counts);
      } catch {
        setMemberCounts({});
      }
    };
    fetchMemberCounts();
  }, []);

  const fetchMembers = async (state) => {
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

  const getMemberCount = (state) => {
    return memberCounts[state] != null ? memberCounts[state] : '...';
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>State Chapters</h1>
      <p className='text-gray-300 text-lg mb-8'>Browse our state chapters, meet the coordinators, and get involved locally.</p>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[
          { state: 'Lagos', coordinator: 'Chidi Okafor', email: 'lagos@ukgin.org', phone: '+234 801 234 5678', established: '2021', description: 'One of the largest and most active chapters, hosting monthly meetings and annual cultural festivals.', upcoming: 'Monthly networking hangout - Aug 2026' },
          { state: 'Anambra', coordinator: 'Ngozi Eze', email: 'anambra@ukgin.org', phone: '+234 802 345 6789', established: '2021', description: 'Focused on grassroots community support, education sponsorships, and cultural heritage projects.', upcoming: 'Cultural heritage tour - Sep 2026' },
          { state: 'Rivers', coordinator: 'Emeka Nwosu', email: 'rivers@ukgin.org', phone: '+234 803 456 7890', established: '2022', description: 'Driving economic empowerment programs and youth mentorship across the Niger Delta region.', upcoming: 'Youth summit - Oct 2026' },
          { state: 'FCT', coordinator: 'Adaeze Okonkwo', email: 'fct@ukgin.org', phone: '+234 804 567 8901', established: '2022', description: 'Liaising with federal institutions and organizing national advocacy and representation programs.', upcoming: 'Federal advocacy day - Nov 2026' },
          { state: 'Imo', coordinator: 'Uchechi Ogbonna', email: 'imo@ukgin.org', phone: '+234 805 678 9012', established: '2023', description: 'Empowering rural communities through education donations and health outreach initiatives.', upcoming: 'Community health outreach - Aug 2026' },
          { state: 'Enugu', coordinator: 'Obioma Nnamdi', email: 'enugu@ukgin.org', phone: '+234 806 789 0123', established: '2023', description: 'Promoting Igbo language preservation and traditional arts through workshops and exhibitions.', upcoming: 'Arts exhibition - Sep 2026' },
        ].map((ch, i) => (
          <div key={i} onClick={() => handleChapterClick(ch)} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition cursor-pointer'>
            <h3 className='text-white font-bold text-xl mb-1'>{ch.state} State</h3>
            <p className='text-yellow-400 text-sm mb-3'>Coordinator: {ch.coordinator}</p>
            <p className='text-gray-400 text-sm mb-4'>{ch.description}</p>
            <div className='flex justify-between text-sm text-gray-500'>
              <span>Est. {ch.established}</span>
              <span>👥 {getMemberCount(ch.state)} members</span>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6' onClick={() => { setSelected(null); setMembers([]); }}>
          <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-yellow-400'>{selected.state} State Chapter</h3>
                <p className='text-gray-400 text-sm'>Est. {selected.established} • 👥 {getMemberCount(selected.state)} members</p>
              </div>
              <button onClick={() => { setSelected(null); setMembers([]); }} className='text-gray-400 hover:text-white'>✕</button>
            </div>
            <p className='text-gray-300 mb-6'>{selected.description}</p>
            <div className='space-y-2 text-sm mb-6'>
              <p><span className='text-gray-400'>Coordinator:</span> <span className='text-white'>{selected.coordinator}</span></p>
              <p><span className='text-gray-400'>Email:</span> <span className='text-white'>{selected.email}</span></p>
              <p><span className='text-gray-400'>Phone:</span> <span className='text-white'>{selected.phone}</span></p>
              <p><span className='text-gray-400'>Upcoming:</span> <span className='text-white'>{selected.upcoming}</span></p>
            </div>
            <h4 className='text-lg font-bold text-yellow-400 mb-4'>Members ({members.length})</h4>
            {loadingMembers ? (
              <p className='text-gray-400 text-sm'>Loading members...</p>
            ) : members.length > 0 ? (
              <environment_details className='overflow-x-auto mb-6 border border-gray-800 rounded-xl'>
                <summary className='p-3 text-yellow-400 font-bold cursor-pointer hover:text-yellow-300'>Member List</summary>
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
                          <span className={`px-2 py-1 rounded text-xs ${m.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-300' : m.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : m.role === 'finance_manager' ? 'bg-green-500/20 text-green-300' : m.role === 'support_staff' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>{m.role}</span>
                        </td>
                        <td className='p-2'><span className={`px-2 py-1 rounded text-xs ${m.kyc_status === 'approved' ? 'bg-green-500/20 text-green-300' : m.kyc_status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{m.kyc_status}</span></td>
                        <td className='p-2 text-gray-500 text-xs'>{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </environment_details>
            ) : (
              <p className='text-gray-500 text-sm'>No members found for this chapter.</p>
            )}
            <div className='flex gap-3 mt-6'>
              <button onClick={() => alert('Feature coming soon: Volunteer signup')} className='bg-yellow-500 text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition'>Get Involved</button>
              <button onClick={() => alert('Feature coming soon: Contact form')} className='bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-600 transition'>Contact Coordinator</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StateChapters;
