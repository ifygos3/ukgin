import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const EVENT_TYPES = ['Conference', 'Summit', 'Festival', 'Volunteer', 'Gala', 'Workshop', 'Meeting', 'Other'];

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responseCounts, setResponseCounts] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', event_date: '', location: '', event_type: '', is_featured: false, is_past: false });
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsList = res.data.results || res.data;
      setEvents(eventsList);
      const counts = {};
      for (const ev of eventsList) {
        try {
          const rRes = await axios.get(`${API_BASE_URL}/users/admin/event-responses/?event_id=${ev.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const responses = rRes.data.results || rRes.data || [];
          counts[ev.id] = {
            going: responses.filter(r => r.response_type === 'going').length,
            interested: responses.filter(r => r.response_type === 'interested').length,
            not_going: responses.filter(r => r.response_type === 'not_going').length,
            total: responses.length,
          };
        } catch {
          counts[ev.id] = { going: 0, interested: 0, not_going: 0, total: 0 };
        }
      }
      setResponseCounts(counts);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const openCreate = () => {
    setEditingEvent(null);
    setFormData({ name: '', description: '', event_date: '', location: '', event_type: 'Conference', is_featured: false, is_past: false });
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      name: event.name || '',
      description: event.description || '',
      event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
      location: event.location || '',
      event_type: event.event_type || 'Conference',
      is_featured: event.is_featured || false,
      is_past: event.is_past || false,
    });
  };

  const closeForm = () => {
    setEditingEvent(null);
    setFormData({ name: '', description: '', event_date: '', location: '', event_type: 'Conference', is_featured: false, is_past: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...formData, event_date: new Date(formData.event_date).toISOString() };
      if (editingEvent) {
        await axios.patch(`${API_BASE_URL}/users/events/${editingEvent.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      } else {
        await axios.post(`${API_BASE_URL}/users/events/`, payload, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
      }
      fetchEvents();
      showNotification(editingEvent ? 'Event updated successfully.' : 'Event created successfully.', 'success');
      closeForm();
    } catch (err) { console.error(err);       showNotification('Failed to save event.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/events/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(events.filter(e => e.id !== id));
      showNotification('Event deleted successfully.', 'success');
    } catch (err) { console.error(err); showNotification('Failed to delete event.', 'error'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">Event Management</h1>
        <button onClick={openCreate} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">
          + Add Event
        </button>
      </div>

      {(editingEvent || formData.name !== '' || (!editingEvent && !events.length && !loading)) && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Event Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date & Time *</label>
              <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Event Type</label>
              <select name="event_type" value={formData.event_type} onChange={handleChange} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input type="checkbox" name="is_past" checked={formData.is_past} onChange={handleChange} />
                Past Event
              </label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50">
                {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">ID</th>
              <th className="text-left p-3 text-gray-400">Name</th>
              <th className="text-left p-3 text-gray-400">Type</th>
              <th className="text-left p-3 text-gray-400">Date</th>
              <th className="text-left p-3 text-gray-400">Location</th>
              <th className="text-left p-3 text-gray-400">Featured</th>
              <th className="text-left p-3 text-gray-400">Status</th>
              <th className="text-left p-3 text-gray-400">RSVP (👍/⭐/❌/Total)</th>
              <th className="text-left p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{event.id}</td>
                <td className="p-3 text-white font-bold">{event.name}</td>
                <td className="p-3 text-gray-400">{event.event_type}</td>
                <td className="p-3 text-gray-400 text-xs">{event.event_date ? new Date(event.event_date).toLocaleString() : '—'}</td>
                <td className="p-3 text-gray-400">{event.location}</td>
                <td className="p-3">{event.is_featured ? '✅' : '—'}</td>
                <td className="p-3">{event.is_past ? <span className="text-gray-400">Past</span> : <span className="text-green-400">Upcoming</span>}</td>
                <td className="p-3 text-gray-400 text-xs">
                  {(() => {
                    const c = responseCounts[event.id] || { going: 0, interested: 0, not_going: 0, total: 0 };
                    return `${c.going}/${c.interested}/${c.not_going}/${c.total}`;
                  })()}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(event)} className="text-blue-400 hover:text-blue-300 text-xs font-bold">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300 text-xs font-bold">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {events.length === 0 && !loading && (
        <p className="text-gray-400 text-center py-8">No events found. Create your first event!</p>
      )}
    </div>
  );
};

export default AdminEvents;
