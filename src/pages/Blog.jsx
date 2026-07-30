import React, { useState } from 'react';

const Blog = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [liked, setLiked] = useState({});

  const categories = ['All', 'News', 'Events', 'Culture', 'Youth', 'Leadership', 'Community'];

  const posts = [
    { title: 'UKGIN Annual Conference 2026', category: 'Events', date: 'July 20, 2026', author: 'Admin', desc: 'Join us for our biggest event of the year featuring keynote speakers and community activities.', image: '🏛️', comments: 12, likes: 45 },
    { title: 'New State Chapter Launched in Anambra', category: 'News', date: 'July 15, 2026', author: 'Editor', desc: 'We are excited to announce the launch of our new state chapter in Anambra.', image: '📰', comments: 8, likes: 32 },
    { title: 'Youth Empowerment Program Highlights', category: 'Youth', date: 'July 10, 2026', author: 'Writer', desc: 'Our latest initiative to empower young Igbo entrepreneurs with skills and funding.', image: '💡', comments: 15, likes: 67 },
    { title: 'Preserving Igbo Language and Traditions', category: 'Culture', date: 'July 5, 2026', author: 'Editor', desc: 'How UKGIN is working to preserve and promote Igbo language and cultural traditions.', image: '🎭', comments: 20, likes: 89 },
    { title: 'Leadership Summit Recap', category: 'Leadership', date: 'June 28, 2026', author: 'Admin', desc: 'A recap of our recent leadership summit and the key takeaways for our members.', image: '🎤', comments: 10, likes: 54 },
    { title: 'Community Clean-Up Drive Results', category: 'Community', date: 'June 20, 2026', author: 'Writer', desc: 'See the impact of our latest community clean-up drive across multiple locations.', image: '🌍', comments: 6, likes: 41 },
  ];

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Blog & News</h1>
      <p className='text-gray-300 text-lg mb-8'>Stay updated with the latest news, events, and stories from UKGIN.</p>

      <div className='flex flex-wrap gap-4 mb-8'>
        <input
          type='text'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search articles...'
          className='flex-1 bg-black p-3 rounded-xl border border-gray-700 text-white min-w-[200px]'
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className='bg-black p-3 rounded-xl border border-gray-700 text-white'>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className='space-y-6'>
        {filtered.map((post, i) => (
          <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition flex flex-col md:flex-row gap-6'>
            <div className='text-5xl md:w-20 text-center md:text-left'>{post.image}</div>
            <div className='flex-1'>
              <div className='flex flex-wrap items-center gap-3 mb-2'>
                <span className='bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold'>{post.category}</span>
                <span className='text-gray-500 text-xs'>{post.date}</span>
                <span className='text-gray-500 text-xs'>By {post.author}</span>
              </div>
              <h3 className='text-white font-bold text-xl mb-2'>{post.title}</h3>
              <p className='text-gray-400 text-sm leading-6 mb-3'>{post.desc}</p>
              <div className='flex gap-4 text-gray-500 text-xs'>
                <span>💬 {post.comments} comments</span>
                <button onClick={() => setLiked(prev => ({...prev, [i]: !prev[i]}))} className={`hover:text-yellow-400 transition ${liked[i] ? 'text-red-400' : ''}`}>
                  {liked[i] ? '❤️' : '🤍'} {post.likes + (liked[i] ? 1 : 0)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className='text-gray-400 text-center'>No articles found.</p>}
    </div>
  );
};

export default Blog;