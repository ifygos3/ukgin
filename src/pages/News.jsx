import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const News = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/category-list/`);
        setCategories(res.data || []);
      } catch {
        setCategories([]);
      }
    };
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/posts/?type=news`);
        setNews(res.data || []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchNews();
  }, []);

  const filtered = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || (n.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (n.category_name && n.category_name === category) || (n.category && categories.find(c => c.id === n.category)?.name === category);
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">News</h1>
        <p className="text-gray-300">Loading news...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">News & Announcements</h1>
          <p className="text-gray-300 text-lg">Stay updated with the latest news, announcements, and events from UKGIN.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label htmlFor="news-search" className="sr-only">Search news</label>
          <input
            id="news-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news..."
            className="flex-1 bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors min-w-[200px]"
          />
          <label htmlFor="news-category" className="sr-only">Filter by category</label>
          <select
            id="news-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          {filtered.length === 0 ? (
            <EmptyState icon="📰" title="No news articles found" description="Try adjusting your search or filter." />
          ) : (
            filtered.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.slug}`}
                className="block bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full md:w-48 h-32 object-cover rounded-xl" loading="lazy" />
                  ) : (
                    <div className="w-full md:w-48 h-32 bg-gray-800 rounded-xl flex items-center justify-center text-3xl">📰</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {item.category_name && (
                        <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{item.category_name}</span>
                      )}
                      <span className="text-gray-500 text-sm">{item.published_date ? new Date(item.published_date).toLocaleDateString() : '—'}</span>
                      <span className="text-gray-500 text-sm">Last updated: {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : (item.published_date ? new Date(item.published_date).toLocaleDateString() : '—')}</span>
                    </div>
                    <h3 className="text-white font-bold text-xl md:text-2xl mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-3 leading-6">{item.excerpt || item.content?.substring(0, 200) + '...'}</p>
                    <div className="mt-3 text-sm text-gray-500">Views: {item.view_count}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
