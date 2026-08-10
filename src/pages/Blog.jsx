import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const categories = ['All', 'News', 'Events', 'Culture', 'Youth', 'Leadership', 'Community'];

const Blog = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [liked, setLiked] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/posts/?type=blog`);
        setPosts(res.data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered = posts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || (p.category_name && p.category_name === category);
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Blog & News</h1>
        <p className="text-gray-400">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Blog & News</h1>
          <p className="text-gray-300 text-lg">Stay updated with the latest news, events, and stories from UKGIN.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <input
            id="blog-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="flex-1 bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors min-w-[200px]"
          />
          <label htmlFor="blog-category" className="sr-only">Filter by category</label>
          <select
            id="blog-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <EmptyState icon="📝" title="No articles found" description="Try adjusting your search or filter to find what you're looking for." />
          ) : (
            filtered.map((post) => (
              <div
                key={post.id}
                className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.01] flex flex-col md:flex-row gap-6 group"
              >
                {post.image_url ? (
                  <img src={post.image_url} alt={post.title} className="w-full md:w-24 h-32 object-cover rounded-xl" loading="lazy" />
                ) : (
                  <div className="w-full md:w-24 h-32 bg-gray-800 rounded-xl flex items-center justify-center text-3xl">📝</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    {post.category_name && (
                      <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{post.category_name}</span>
                    )}
                    <span className="text-gray-500 text-sm">{post.published_date ? new Date(post.published_date).toLocaleDateString() : '—'}</span>
                    <span className="text-gray-500 text-sm">By {post.author_display || 'Admin'}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-yellow-400 transition-colors">{post.title}</h3>
                  <p className="text-gray-400 text-sm leading-6 mb-4">{post.excerpt || post.content?.substring(0, 200) + '...'}</p>
                  <div className="flex gap-4 text-gray-500 text-sm mb-2">
                    <span>Views: {post.view_count}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="text-yellow-400 hover:text-yellow-300 text-sm font-bold transition-colors"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
