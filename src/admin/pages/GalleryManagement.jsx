import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const resolveMediaUrl = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return trimmed;
};

const GalleryMedia = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const rawUrl = item?.media_url || item?.image_url || item?.image || item?.url || item?.secure_url || item?.src;
  const mediaUrl = resolveMediaUrl(rawUrl);
  const mediaType = item?.media_type === 'video' || /\.(mp4|mov|webm|ogg|ogv|avi|mkv)$/i.test(mediaUrl) ? 'video' : 'image';
  const videoType = mediaType === 'video' ? (mediaUrl.endsWith('.webm') ? 'video/webm' : mediaUrl.endsWith('.ogg') || mediaUrl.endsWith('.ogv') ? 'video/ogg' : 'video/mp4') : null;

  if (!mediaUrl || failed) {
    return <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-4xl">🖼️</div>;
  }

  if (mediaType === 'video') {
    return (
      <video
        src={mediaUrl}
        type={videoType}
        controls
        controlsList="nodownload"
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        className="w-full h-48 object-contain bg-black"
        onError={() => { console.error('Admin video failed to load:', mediaUrl, 'raw:', rawUrl); setFailed(true); }}
      />
    );
  }

  return <img src={mediaUrl} alt={item?.title || 'Gallery image'} className="w-full h-48 object-cover" loading="lazy" onError={() => setFailed(true)} />;
};

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [meta, setMeta] = useState({ title: '', caption: '', is_active: true });
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', is_active: true });
  const [dragActive, setDragActive] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowForm(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fetchImages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/gallery-items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setImages(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error(err);
      setImages([]);
    }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowForm(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) { showNotification('Select an image to upload.', 'error'); return; }
    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('image', selectedFile);
    if (meta.title) formData.append('title', meta.title);
    if (meta.caption) formData.append('caption', meta.caption);
    formData.append('is_active', meta.is_active ? 'true' : 'false');
    try {
      await axios.post(`${API_BASE_URL}/users/gallery-items/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (event) => {
          const total = event.total || selectedFile.size;
          if (total > 0) {
            const rawPercent = (event.loaded * 100) / total;
            const percent = Math.min(90, Math.max(0, Math.round(rawPercent)));
            setUploadProgress(percent);
          }
        },
      });
      setUploadProgress(100);
      showNotification('Image/video uploaded successfully.', 'success');
      await fetchImages();
      setShowForm(false);
      setSelectedFile(null);
      setPreviewUrl('');
      setMeta({ title: '', caption: '', is_active: true });
      setTimeout(() => setUploadProgress(0), 400);
    } catch (err) {
      console.error(err);
      const data = err?.response?.data;
      const message = (typeof data === 'string' ? data : data?.detail || data?.image?.[0] || data?.error || data?.message) || err?.message || 'Upload failed.';
      showNotification(message, 'error');
      setUploadProgress(0);
    }
    finally { setUploading(false); }
  };

  const openEditModal = (img) => {
    setEditingItem(img);
    setEditForm({ title: img.title || '', description: img.description || '', is_active: img.is_active ?? true });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      await axios.patch(`${API_BASE_URL}/users/gallery-items/${editingItem.id}/`, {
        title: editForm.title,
        description: editForm.description,
        is_active: editForm.is_active,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((prev) => prev.map((item) => item.id === editingItem.id ? { ...item, title: editForm.title, description: editForm.description, is_active: editForm.is_active } : item));
      showNotification('Gallery item updated successfully.', 'success');
      setEditingItem(null);
      setEditForm({ title: '', description: '', is_active: true });
    } catch (err) {
      console.error(err);
      showNotification('Failed to update gallery item.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/gallery-items/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setImages(images.filter(img => img.id !== id));
      showNotification('Image/video deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete image.', 'error'); }
  };

  const toggleActive = async (img) => {
    try {
      await axios.patch(`${API_BASE_URL}/users/gallery-items/${img.id}/`, { is_active: !img.is_active }, { headers: { Authorization: `Bearer ${token}` } });
      setImages((prev) => prev.map((item) => item.id === img.id ? { ...item, is_active: !img.is_active } : item));
      showNotification(`Gallery item ${!img.is_active ? 'activated' : 'deactivated'} successfully.`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to update gallery item status.', 'error');
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div
      className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-yellow-400/20 border-4 border-dashed border-yellow-400 backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-2xl border border-yellow-400 text-center">
            <p className="text-4xl mb-4">📁</p>
            <p className="text-2xl font-bold text-yellow-400">Drop image or video here</p>
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Gallery Management </h1>
        <>
          <label className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-yellow-500 transition">
            + Add Image / Video
            <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
          </label>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
              <form onSubmit={handleUploadSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-lg">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Upload Gallery Image</h3>
                {previewUrl && selectedFile && selectedFile.type.startsWith('video/') ? (
                  <video src={previewUrl} controls controlsList="nodownload" preload="metadata" playsInline className="w-full h-48 object-cover rounded mb-4" />
                ) : (
                  previewUrl && <img src={previewUrl} alt="preview" className="w-full h-48 object-cover rounded mb-4" />
                )}
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Title</label>
                  <input name="title" value={meta.title} onChange={(e) => setMeta(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-3" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Caption</label>
                  <textarea name="caption" value={meta.caption} onChange={(e) => setMeta(prev => ({ ...prev, caption: e.target.value }))} rows={3} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-3" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input type="checkbox" id="upload_is_active" checked={meta.is_active} onChange={(e) => setMeta(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-400" />
                  <label htmlFor="upload_is_active" className="text-sm text-gray-400">Active (show in public gallery)</label>
                </div>
                {uploading && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-800 rounded-full h-2.5">
                      <div className="bg-yellow-400 h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{uploadProgress}% uploaded</p>
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowForm(false); setSelectedFile(null); setPreviewUrl(''); setMeta({ title: '', caption: '', is_active: true }); setUploadProgress(0); }} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
                  <button type="submit" disabled={uploading} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500">{uploading ? 'Uploading...' : 'Upload'}</button>
                </div>
              </form>
            </div>
          )}
        </>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <GalleryMedia item={img} />
            <div className="p-3 flex flex-col gap-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-gray-300 text-sm truncate">{img.title || 'Untitled'}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${img.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {img.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(img)} className={`px-2 py-1 rounded-lg text-xs font-bold ${img.is_active ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                  {img.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => openEditModal(img)} className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-blue-500">Edit</button>
                <button onClick={() => handleDelete(img.id)} className="bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold hover:bg-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6" onClick={() => setEditingItem(null)}>
          <form onSubmit={handleEditSubmit} className="bg-gray-900 p-6 rounded-xl border border-gray-800 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Edit Gallery Item</h3>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title</label>
              <input name="title" value={editForm.title} onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-3" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea name="description" value={editForm.description} onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-3" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="is_active" checked={editForm.is_active} onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))} className="w-4 h-4 rounded border-gray-700 bg-black text-yellow-400 focus:ring-yellow-400" />
              <label htmlFor="is_active" className="text-sm text-gray-400">Active (show in public gallery)</label>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
