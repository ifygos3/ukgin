import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Announcement = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/announcements/`);
        const list = res.data.results || res.data || [];
        const found = list.find(a => a.id === parseInt(id));
        setAnnouncement(found || null);
      } catch {
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <Skeleton className="w-32 h-4 mb-4" />
          <Skeleton className="w-3/4 h-10 mb-4" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-full h-4 mb-2" />
          <Skeleton className="w-2/3 h-4" />
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Announcement</h1>
        <p className="text-gray-400 mb-6">Announcement not found or no longer available.</p>
        <Link to="/" className="text-yellow-400 hover:text-yellow-300">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-yellow-400 hover:text-yellow-300 text-sm mb-4 inline-block transition-colors">← Back to Home</Link>
        <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-3xl border border-gray-800">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">{announcement.title}</h1>
          <p className="text-gray-500 text-xs mb-6">{new Date(announcement.created_at).toLocaleString()}</p>
          <p className="text-gray-300 leading-8 whitespace-pre-line">{announcement.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
