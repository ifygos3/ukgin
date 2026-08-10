import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton, EmptyState } from '../components/ui';

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
      const eventsRes = await axios.get(`${API_BASE_URL}/users/public/events/`);
      const data = eventsRes.data.results || eventsRes.data;
      setEvents(data);
      try {
        const responsesRes = await axios.get(`${API_BASE_URL}/users/public/event-responses/`);
        const allResponses = responsesRes.data.results || responsesRes.data;
        const resMap = {};
        for (const ev of data) {
          const eventResponses = allResponses.filter(r => r.event === ev.id || r.event_id === ev.id);
          const mine = eventResponses.find(r => r.user?.id === user?.id);
          resMap[ev.id] = { responses: eventResponses, mine };
        }
        setResponses(resMap);
      } catch {
        const resMap = {};
        for (const ev of data) {
          resMap[ev.id] = { responses: [], mine: null };
        }
        setResponses(resMap);
      }
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

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filtered = useMemo(() => filter === 'upcoming' ? events.filter(e => !e.is_past) : events.filter(e => e.is_past), [filter, events]);

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
    <div className='min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-5xl md:text-6xl font-extrabold text-yellow-400 text-center mb-12'>Events</h1>

        <div className='flex flex-wrap justify-center gap-4 mb-10'>
          <button onClick={() => setFilter('upcoming')} className={`px-6 py-3 rounded-full font-bold text-lg transition ${filter === 'upcoming' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Upcoming</button>
          <button onClick={() => setFilter('past')} className={`px-6 py-3 rounded-full font-bold text-lg transition ${filter === 'past' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>Past Events</button>
        </div>

        {loading ? (
          <div className='space-y-6'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-gray-900 p-7 md:p-8 rounded-3xl border border-gray-800 space-y-4'>
                <Skeleton className='w-32 h-6' />
                <Skeleton className='w-3/4 h-8' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-1/2 h-4' />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="📅" title="No events found" description="There are no events in this category right now." />
        ) : (
          <div className='space-y-6'>
            {filtered.map((e) => {
              const resp = responses[e.id] || { responses: [], mine: null };
              return (
                <div key={e.id} className='bg-gray-900/80 backdrop-blur-sm p-7 md:p-8 rounded-3xl border border-gray-800 hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.01]'>
                  <div className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-4'>
                    <div>
                      <span className='bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold'>{e.event_type}</span>
                      <h3 className='text-white font-extrabold text-2xl md:text-3xl mt-3'>{e.name}</h3>
                    </div>
                    <span className='text-yellow-400 font-bold text-base whitespace-nowrap'>{formatDate(e.event_date)}</span>
                  </div>
                  <p className='text-gray-400 text-lg mb-3'>Location: {e.location}</p>
                  <p className='text-gray-300 text-lg mb-5 leading-8'>{e.description}</p>
                  {!e.is_past && (
                    <div className='flex flex-wrap gap-3 items-center'>
                      {resp.mine && (
                        <span className='text-green-400 text-base font-bold'>Your response: {responseEmoji(resp.mine.response_type)} {responseLabel(resp.mine.response_type)}</span>
                      )}
                      {!isAuthenticated && (
                        <span className='text-gray-400 text-base mr-2'>Login to RSVP</span>
                      )}
                      <button
                        onClick={() => quickRespond(e.id, 'going')}
                        disabled={responding[e.id] === 'going'}
                        className={`px-5 py-3 rounded-xl text-base font-bold transition-colors ${
                          resp.mine?.response_type === 'going'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-600 text-white hover:bg-green-500 disabled:opacity-50'
                        }`}
                      >
                        {responding[e.id] === 'going' ? '...' : `Going ${resp.mine?.response_type === 'going' ? '✓' : ''}`}
                      </button>
                      <button
                        onClick={() => quickRespond(e.id, 'interested')}
                        disabled={responding[e.id] === 'interested'}
                        className={`px-5 py-3 rounded-xl text-base font-bold transition-colors ${
                          resp.mine?.response_type === 'interested'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50'
                        }`}
                      >
                        {responding[e.id] === 'interested' ? '...' : `Interested ${resp.mine?.response_type === 'interested' ? '✓' : ''}`}
                      </button>
                      <button
                        onClick={() => quickRespond(e.id, 'not_going')}
                        disabled={responding[e.id] === 'not_going'}
                        className={`px-5 py-3 rounded-xl text-base font-bold transition-colors ${
                          resp.mine?.response_type === 'not_going'
                            ? 'bg-gray-500 text-white'
                            : 'bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50'
                        }`}
                      >
                        {responding[e.id] === 'not_going' ? '...' : `Can't Go ${resp.mine?.response_type === 'not_going' ? '✓' : ''}`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
