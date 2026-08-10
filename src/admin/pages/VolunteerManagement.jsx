import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const VolunteerManagement = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApplication, setEditingApplication] = useState(null);
  const [formData, setFormData] = useState({ status: 'pending', is_reviewed: false, notes: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchApplications = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/volunteer-applications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const openEdit = (application) => {
    setEditingApplication(application);
    setFormData({
      status: application.status || 'pending',
      is_reviewed: application.is_reviewed || false,
      notes: application.notes || '',
    });
  };

  const closeForm = () => {
    setEditingApplication(null);
    setFormData({ status: 'pending', is_reviewed: false, notes: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingApplication) return;
    setSaving(true);
    try {
      await axios.patch(`${API_BASE_URL}/users/volunteer-applications/${editingApplication.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      fetchApplications();
      showNotification('Application updated successfully.', 'success');
      closeForm();
    } catch (err) {
      console.error(err);
      showNotification('Failed to update volunteer application.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/volunteer-applications/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(applications.filter((app) => app.id !== id));
      showNotification('Application deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete application.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Volunteer Applications</h1>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingApplication ? 'Update Application' : 'Select an application to review'}</h2>
        {editingApplication ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
                  <option value="pending">Pending Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" name="is_reviewed" checked={formData.is_reviewed} onChange={handleChange} className="h-4 w-4 text-yellow-400 bg-gray-800 border-gray-700 rounded" />
                <label className="text-gray-300">Mark as reviewed</label>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Close</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400">Select an application below to update its status, mark it as reviewed, or add notes.</p>
        )}
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-[640px] sm:min-w-0 align-middle">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Name</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Email</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Reviewed</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Submitted</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{application.id}</td>
                  <td className="p-2 sm:p-3 text-white font-bold text-xs sm:text-sm whitespace-nowrap">{application.full_name}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm truncate">{application.email}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{application.status}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{application.is_reviewed ? <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Yes</span> : <span className="bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">No</span>}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(application.created_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      <button onClick={() => openEdit(application)} className="text-blue-400 hover:text-blue-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">Review</button>
                      <button onClick={() => handleDelete(application.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && applications.length === 0 && (
        <p className="text-gray-400 text-center py-8">No volunteer applications found.</p>
      )}
    </div>
  );
};

export default VolunteerManagement;
