import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', excerpt: '', content: '', post_type: 'news', category: null, is_published: true, is_featured: false });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.results || res.data || []);
    } catch {
      setCategories([]);
    }
  }, [token]);

  useEffect(() => { Promise.resolve().then(() => { fetchPosts(); fetchCategories(); }); }, [fetchPosts, fetchCategories]);

  const openCreate = () => {
    setEditingPost(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', post_type: 'news', category: null, is_published: true, is_featured: false });
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      post_type: post.post_type || 'news',
      category: post.category || null,
      is_published: post.is_published !== undefined ? post.is_published : true,
      is_featured: post.is_featured || false,
    });
  };

  const closeForm = () => {
    setEditingPost(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', post_type: 'news', category: null, is_published: true, is_featured: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, category: formData.category || null };
      if (editingPost) {
        await axios.patch(`${API_BASE_URL}/users/posts/${editingPost.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/posts/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchPosts();
      showNotification(editingPost ? 'Post updated successfully.' : 'Post created successfully.', 'success');
      closeForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.category?.[0] || err?.response?.data?.slug?.[0] || 'Failed to save post.';
      showNotification(msg, 'error');
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/posts/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setPosts(posts.filter(p => p.id !== id));
      showNotification('Post deleted successfully.', 'success');
    } catch (err) {
      if (err?.response?.status === 404) {
        setPosts(posts.filter(p => p.id !== id));
        showNotification('Post was already removed.', 'warning');
      } else {
        console.error(err);
        showNotification('Failed to delete post.', 'error');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">News & Blog Management</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ New Post</button>
      </div>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingPost ? 'Edit Post' : 'New Post'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select name="post_type" value={formData.post_type} onChange={handleChange} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
                <option value="news">News</option>
                <option value="blog">Blog</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <select name="category" value={formData.category || ''} onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value ? parseInt(e.target.value) : null }))} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows="2" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content *</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="6" required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white font-mono" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} /> Published
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} /> Featured
            </label>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={closeForm} className="bg-gray-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold">{post.title}</h3>
              <span className="text-gray-400 text-sm">{post.post_type} | {post.is_published ? 'Published' : 'Draft'}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(post)} className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-400">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostManagement;
