import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Projects = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [projects, setProjects] = useState([]);
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
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/projects/`);
        setProjects(res.data || []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
    fetchProjects();
  }, []);

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || (p.category_name && p.category_name === category);
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6">Projects</h1>
        <p className="text-gray-300">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Our Projects</h1>
          <p className="text-gray-300 text-lg">Explore the community development projects and initiatives driven by UKGIN.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <input
            id="project-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="flex-1 bg-black p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors min-w-[200px]"
          />
          <label htmlFor="project-category" className="sr-only">Filter by category</label>
          <select
            id="project-category"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <EmptyState icon="🏗️" title="No projects found" description="Try adjusting your search or filter." />
          ) : (
            filtered.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="block bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition overflow-hidden group"
              >
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-5xl">🏗️</div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    {project.category_name && (
                      <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{project.category_name}</span>
                    )}
                    {project.is_featured && (
                      <span className="bg-purple-400/20 text-purple-300 px-2 py-1 rounded text-sm font-bold">Featured</span>
                    )}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-yellow-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-6">{project.description}</p>
                  {project.start_date && (
                    <div className="text-sm text-gray-500 mb-2">
                      Started: {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {project.location && (
                    <div className="text-sm text-gray-500">Location: {project.location}</div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
