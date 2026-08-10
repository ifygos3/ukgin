import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', slug: '', description: '', content: '', category: '', is_active: true, is_featured: false, location: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/projects/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openCreate = () => {
    setEditingProject(null);
    setFormData({ title: '', slug: '', description: '', content: '', category: '', is_active: true, is_featured: false, location: '' });
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      content: project.content || '',
      category: project.category || '',
      is_active: project.is_active !== undefined ? project.is_active : true,
      is_featured: project.is_featured || false,
      location: project.location || '',
    });
  };

  const closeForm = () => {
    setEditingProject(null);
    setFormData({ title: '', slug: '', description: '', content: '', category: '', is_active: true, is_featured: false, location: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProject) {
        await axios.patch(`${API_BASE_URL}/users/projects/${editingProject.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/projects/`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchProjects();
      showNotification(editingProject ? 'Project updated successfully.' : 'Project created successfully.', 'success');
      closeForm();
    } catch (err) { console.error(err);       showNotification('Failed to save project.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/projects/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setProjects(projects.filter(p => p.id !== id));
      showNotification('Project deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete project.', 'error'); }
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
        <h1 className="text-3xl font-bold text-yellow-400">Project Management</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">+ New Project</button>
      </div>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingProject ? 'Edit Project' : 'New Project'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content</label>
            <textarea name="content" value={formData.content} onChange={handleChange} rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white font-mono" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Active
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
        {projects.map((project) => (
          <div key={project.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="text-white font-bold">{project.title}</h3>
              <span className="text-gray-400 text-sm">{project.is_active ? 'Active' : 'Inactive'} | {project.is_featured ? 'Featured' : ''}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(project)} className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-400">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagement;
