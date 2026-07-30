import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupportTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [replyText, setReplyText] = useState({});
  const token = localStorage.getItem('access_token');

  const fetchTickets = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      const res = await axios.get(`http://127.0.0.1:8000/users/support-tickets/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const handleReply = async (ticketId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/ticket-replies/`, { ticket: ticketId, message: replyText[ticketId] }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setReplyText({ ...replyText, [ticketId]: '' });
      fetchTickets();
    } catch (err) { console.error(err); }
  };

  const handleClose = async (ticketId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/support-tickets/${ticketId}/close/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) { console.error(err); }
  };

  const handleReopen = async (ticketId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/support-tickets/${ticketId}/reopen/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) { console.error(err); }
  };

  const priorityBadge = (p) => {
    const colors = { low: 'bg-green-500/20 text-green-300', medium: 'bg-yellow-500/20 text-yellow-300', high: 'bg-orange-500/20 text-orange-300', urgent: 'bg-red-500/20 text-red-300' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[p] || 'bg-gray-500/20 text-gray-300'}`}>{p}</span>;
  };

  const statusBadge = (s) => {
    const colors = { open: 'bg-green-500/20 text-green-300', in_progress: 'bg-blue-500/20 text-blue-300', closed: 'bg-gray-500/20 text-gray-300', reopened: 'bg-orange-500/20 text-orange-300' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[s] || 'bg-gray-500/20 text-gray-300'}`}>{s}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Support Tickets</h1>
      <div className="flex gap-4 mb-6">
        {['all', 'open', 'in_progress', 'closed', 'reopened'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-white font-bold">{ticket.subject}</span>
                <span className="ml-3 text-gray-500 text-sm">#{ticket.id}</span>
              </div>
              <div className="flex gap-2">
                {priorityBadge(ticket.priority)}
                {statusBadge(ticket.status)}
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-3">{ticket.description}</p>
            <div className="flex gap-2 mb-3">
              <button onClick={() => handleClose(ticket.id)} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold">Close</button>
              <button onClick={() => handleReopen(ticket.id)} className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Reopen</button>
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={replyText[ticket.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                  placeholder="Type a reply..."
                  className="flex-1 bg-black p-2 rounded-lg border border-gray-700 text-white text-sm"
                />
                <button onClick={() => handleReply(ticket.id)} className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500">Reply</button>
              </div>
              {(ticket.replies || []).map((reply, i) => (
                <div key={i} className="bg-black/50 p-2 rounded-lg mb-2 text-sm">
                  <span className="text-yellow-400 text-xs">{reply.author?.full_name}</span>
                  <p className="text-gray-300 mt-1">{reply.message}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketManagement;