import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Events = () => {
  const [filter, setFilter] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState({});
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/public/events/`);
      const data = res.data.results || res.data;
      setEvents(data);
      const resMap = {};
      for (const ev of data) {
        try {
          const rRes = await axios.get(`${API_BASE_URL}/users/public/event-responses/?event_id=${ev.id}`);
          const eventResponses = rRes.data.results || rRes.data;
          const mine = eventResponses.find(r => r.user?.id === user?.id);
          resMap[ev.id] = { responses: eventResponses, mine };
        } catch {
          resMap[ev.id] = { responses: [], mine: null };
        }
      }
      setResponses(resMap);
    } catch {
      setEvents([
        { id: 1, name: 'Annual General Meeting', description: 'Our biggest annual event featuring keynote speakers and community activities.', event_date: '2026-08-15T10:00:00Z', location: 'Abuja, Nigeria', event_type: 'Conference', is_featured: true, is_past: false },
        { id: 2, name: 'Youth Leadership Summit', description: 'Empowering young leaders with skills, mentorship, and networking opportunities.', event_date: '2026-09-05T10:00:00Z', location: 'Lagos, Nigeria', event_type: 'Summit', is_featured: false, is_past: false },
        { id: 3, name: 'Cultural Festival', description: 'Celebrating Igbo culture with music, dance, food, and art.', event_date: '2026-10-01T10:00:00Z', location: 'London, UK', event_type: 'Festival', is_featured: true, is_past: false },
        { id: 4, name: 'Community Clean-Up Drive', description: 'Join us in making a difference through community service.', event_date: '2026-11-15T10:00:00Z', location: 'Multiple Locations', event_type: 'Volunteer', is_featured: false, is_past: false },
        { id: 5, name: 'Annual Charity Gala', description: 'An evening of celebration, awards, and fundraising for community projects.', event_date: '2026-12-20T10:00:00Z', location: 'Abuja, Nigeria', event_type: 'Gala', is_featured: true, is_past: false },
      ]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const filtered = filter === 'upcoming' ? events.filter(e => !e.is_past) : events.filter(e => e.is_past);

  const quickRespond = async (eventId, responseType) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setResponding(prev => ({ ...prev, [eventId]: responseType }));
    try {
      await axios.post(`${API_BASE_URL}/users/event-responses/`, { event: eventId, response_type: responseType, message: '' }, { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } });
      await fetchEvents();
    } catch (err) {
      console.error(err);
      alert('Failed to respond. Please try again.');
    } finally {
      setResponding(prev => ({ ...prev, [eventId]: null }));
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const responseLabel = (type) => ({ going: 'Going', interested: 'Interested', not_going: 'Not Going' }[type] || type);
  const responseEmoji = (type) => ({ going: '👍', interested: '⭐', not_going: '❌' }[type] || '');

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Events</h1>
      <div className='flex gap-4 mb-8'>
        <button onClick={() => setFilter('upcoming')} className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === 'upcoming' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300'}`}>Upcoming</button>
        <button onClick={() => setFilter('past')} className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === 'past' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-gray-300'}`}>Past Events</button>
      </div>

      {loading && <div className='text-center text-gray-400'>Loading events...</div>}

      <div className='space-y-6'>
        {filtered.map((e) => {
          const resp = responses[e.id] || { responses: [], mine: null };
          return (
            <div key={e.id} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition'>
              <div className='flex flex-wrap justify-between items-start gap-4 mb-3'>
                <div>
                  <span className='bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-bold'>{e.event_type}</span>
                  <h3 className='text-white font-bold text-xl mt-2'>{e.name}</h3>
                </div>
                <span className='text-yellow-400 font-bold text-sm'>{formatDate(e.event_date)}</span>
              </div>
              <p className='text-gray-400 text-sm mb-2'>📍 {e.location}</p>
              <p className='text-gray-300 text-sm mb-4'>{e.description}</p>
              {!e.is_past && (
                <div className='flex flex-wrap gap-3 items-center'>
                {resp.mine && (
                    <span className='text-green-400 text-sm font-bold'>Your response: {responseEmoji(resp.mine.response_type)} {responseLabel(resp.mine.response_type)}</span>
                )}
                {!isAuthenticated && (
                  <span className='text-gray-400 text-sm mr-2'>Login to RSVP</span>
                )}
                <button
                  onClick={() => quickRespond(e.id, 'going')}
                  disabled={responding[e.id] === 'going'}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    resp.mine?.response_type === 'going'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-600 text-white hover:bg-green-500 disabled:opacity-50'
                  }`}
                >
                  {responding[e.id] === 'going' ? '...' : `👍 ${resp.mine?.response_type === 'going' ? 'Going ✓' : 'Going'}`}
                </button>
                <button
                  onClick={() => quickRespond(e.id, 'interested')}
                  disabled={responding[e.id] === 'interested'}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    resp.mine?.response_type === 'interested'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50'
                  }`}
                >
                  {responding[e.id] === 'interested' ? '...' : `⭐ ${resp.mine?.response_type === 'interested' ? 'Interested ✓' : 'Interested'}`}
                </button>
                <button
                  onClick={() => quickRespond(e.id, 'not_going')}
                  disabled={responding[e.id] === 'not_going'}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                    resp.mine?.response_type === 'not_going'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50'
                  }`}
                >
                  {responding[e.id] === 'not_going' ? '...' : `❌ ${resp.mine?.response_type === 'not_going' ? "Can't Go ✓" : "Can't Go"}`}
                </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {!loading && filtered.length === 0 && <p className='text-gray-400 text-center'>No events found.</p>}
    </div>
  );
};

export default Events;
