import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/projects/${slug}/`);
        setProject(res.data);
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-32 h-4 mb-4" />
          <Skeleton className="w-full h-64 md:h-80 rounded-2xl mb-6" />
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white text-center">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Project not found</h2>
        <Link to="/projects" className="text-yellow-400 hover:text-yellow-300">← Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to="/projects" className="text-yellow-400 hover:text-yellow-300 text-sm mb-6 inline-block transition-colors">← Back to Projects</Link>
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6" loading="lazy" />
        ) : (
          <div className="w-full h-64 bg-gray-800 rounded-2xl mb-6 flex items-center justify-center text-6xl">🏗️</div>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {project.category_name && (
            <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{project.category_name}</span>
          )}
          {project.is_featured && (
            <span className="bg-purple-400/20 text-purple-300 px-2 py-1 rounded text-sm font-bold">Featured</span>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">{project.title}</h1>
        {project.start_date && project.end_date && (
          <p className="text-gray-400 text-sm mb-4">
            📅 {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
          </p>
        )}
        {project.location && (
          <p className="text-gray-400 text-sm mb-6">📍 {project.location}</p>
        )}
        <div className="prose prose-invert prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
};

export default ProjectDetail;
