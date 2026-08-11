import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ContactMessageManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMessage, setEditingMessage] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', is_read: false, responded: false, response_text: '' });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/contact-messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const openEdit = (message) => {
    setEditingMessage(message);
    setFormData({
      name: message.name || '',
      email: message.email || '',
      subject: message.subject || '',
      message: message.message || '',
      is_read: message.is_read || false,
      responded: message.responded || false,
      response_text: message.response_text || '',
    });
  };

  const closeForm = () => {
    setEditingMessage(null);
    setFormData({ name: '', email: '', subject: '', message: '', is_read: false, responded: false, response_text: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingMessage) {
      return;
    }
    setSaving(true);
    try {
      await axios.patch(`${API_BASE_URL}/users/contact-messages/${editingMessage.id}/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      fetchMessages();
      showNotification('Message updated successfully.', 'success');
      closeForm();
    } catch (err) {
      console.error(err);
      showNotification('Failed to save message updates.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/contact-messages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(messages.filter((msg) => msg.id !== id));
      showNotification('Message deleted successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete message.', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Contact Messages</h1>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingMessage ? 'Update Message' : 'Select a message to view details'}</h2>
        {editingMessage ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} disabled className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 text-gray-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} disabled className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 text-gray-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} disabled className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 text-gray-300" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Message</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="4" disabled className="w-full bg-gray-800 p-3 rounded-xl border border-gray-700 text-gray-300" />
            </div>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="is_read" checked={formData.is_read} onChange={handleChange} />
              Mark as read
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" name="responded" checked={formData.responded} onChange={handleChange} />
              Mark as responded
            </label>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Response Text</label>
              <textarea name="response_text" value={formData.response_text} onChange={handleChange} rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Close</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Updates'}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-gray-400">Select a message from the table below to update its read/responded status or add a response.</p>
        )}
      </div>

      <div className="w-full overflow-x-auto overscroll-x-contain" style={{WebkitOverflowScrolling: 'touch', touchAction: 'pan-x'}}>
        <div className="min-w-[720px] w-full">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{tableLayout: 'fixed'}}>
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Name</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Email</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Subject</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Read</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Responded</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Received</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{msg.id}</td>
                  <td className="p-2 sm:p-3 text-white font-bold text-xs sm:text-sm whitespace-nowrap">{msg.name}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm truncate">{msg.email}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm truncate max-w-xs">{msg.subject}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{msg.is_read ? <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Yes</span> : <span className="bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">No</span>}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">{msg.responded ? <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">Yes</span> : <span className="bg-gray-500/20 text-gray-300 px-1.5 py-0.5 rounded text-[10px] sm:text-xs">No</span>}</td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs sm:text-sm whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      <button onClick={() => openEdit(msg)} className="text-blue-400 hover:text-blue-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">View</button>
                      <button onClick={() => handleDelete(msg.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && messages.length === 0 && (
        <p className="text-gray-400 text-center py-8">No contact messages found.</p>
      )}
    </div>
  );
};

export default ContactMessageManagement;
