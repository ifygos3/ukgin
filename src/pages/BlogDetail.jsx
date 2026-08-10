import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PostDetail = ({ type, backTo }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/posts/${slug}/`);
        if (type && res.data.post_type !== type) {
          navigate(backTo);
          return;
        }
        setPost(res.data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, navigate, type, backTo]);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="w-32 h-4 mb-4" />
          <Skeleton className="w-full h-64 md:h-80 rounded-2xl mb-6" />
          <Skeleton className="w-3/4 h-8 mb-4" />
          <Skeleton className="w-1/2 h-4 mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} variant="text" className="w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white text-center">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">{type === 'blog' ? 'Blog post' : 'News article'} not found</h2>
        <Link to={backTo} className="text-yellow-400 hover:text-yellow-300">← Back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <Link to={backTo} className="text-yellow-400 hover:text-yellow-300 text-sm mb-6 inline-block transition-colors">← Back</Link>
        {post.image_url ? (
          <img src={post.image_url} alt={post.title} className="w-full h-64 md:h-80 object-cover rounded-2xl mb-6" loading="lazy" />
        ) : (
          <div className="w-full h-64 bg-gray-800 rounded-2xl mb-6 flex items-center justify-center text-6xl">{type === 'blog' ? '📝' : '📰'}</div>
        )}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category_name && (
            <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-sm font-bold">{post.category_name}</span>
          )}
          <span className="text-gray-500 text-sm">{post.published_date ? new Date(post.published_date).toLocaleDateString() : '—'}</span>
          <span className="text-gray-500 text-sm">👁️ {post.view_count} views</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-4">{post.title}</h1>
        <p className="text-gray-400 mb-6">By {post.author_display || 'Admin'}</p>
        <div className="prose prose-invert prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  );
};

export const BlogDetail = (props) => PostDetail({ ...props, type: 'blog', backTo: '/blog' });
export const NewsDetail = (props) => PostDetail({ ...props, type: 'news', backTo: '/news' });

export default BlogDetail;
