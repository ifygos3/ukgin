import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../contexts/NotificationContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const DonationManagement = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem('access_token');
  const { showNotification } = useNotification();

  const fetchDonations = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter === 'approved' ? 'approved' : 'pending');
      const res = await axios.get(`${API_BASE_URL}/users/donations/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/donations/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDonations();
      showNotification('Donation approved successfully.', 'success');
    } catch (err) {
      showNotification('Failed to approve donation.', 'error');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this donation?')) return;
    try {
      await axios.post(`${API_BASE_URL}/users/donations/${id}/reject/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDonations();
      showNotification('Donation rejected.', 'success');
    } catch (err) {
      showNotification('Failed to reject donation.', 'error');
    }
  };

  const openThankYou = (donation) => {
    setSelectedDonation(donation);
    setThankYouMessage(`Dear ${donation.user?.full_name || 'Donor'},\n\nThank you for your generous donation of $${donation.amount} to UKGIN. Your support helps us continue our mission.\n\nBest regards,\nUKGIN Team`);
    setShowThankYouModal(true);
  };

  const sendThankYou = async () => {
    if (!selectedDonation || !selectedDonation.user?.email) {
      showNotification('Donor email not found.', 'error');
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API_BASE_URL}/users/donations/${selectedDonation.id}/send_thank_you/`, {
        message: thankYouMessage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showNotification('Thank you message sent successfully.', 'success');
      setShowThankYouModal(false);
    } catch (err) {
      showNotification('Failed to send thank you message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const getProofUrl = (donation) => {
    const raw = donation.proof_of_donation_url || donation.proof_of_donation;
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    return `${API_BASE_URL}${raw}`;
  };

  if (loading) {
    return <div className="min-h-screen pt-4 px-6 text-white"><p className="text-gray-400">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen pt-4 px-4 sm:px-6 md:px-8 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">Donation Management</h1>
        <div className="text-gray-400 text-sm">{donations.length} donations</div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'approved'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors ${filter === f ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="inline-block min-w-[640px] sm:min-w-0 align-middle">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">ID</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Donor</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Amount</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Method</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Proof</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Status</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Date</th>
                <th className="text-left p-2 sm:p-3 text-gray-400 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-2 sm:p-3 text-gray-400 whitespace-nowrap">{donation.id}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    <div>
                      <p className="text-white font-medium">{donation.user?.full_name || donation.user?.email || 'N/A'}</p>
                      <p className="text-gray-500 text-xs">{donation.user?.email}</p>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 text-yellow-400 font-bold whitespace-nowrap">${donation.amount}</td>
                  <td className="p-2 sm:p-3 text-gray-400 whitespace-nowrap">{donation.payment_method}</td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    {getProofUrl(donation) ? (
                      <a href={getProofUrl(donation)} target="_blank" rel="noopener" className="text-blue-400 hover:text-blue-300 text-xs">View Proof</a>
                    ) : (
                      <span className="text-gray-600 text-xs">No proof</span>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 whitespace-nowrap">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${donation.is_approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {donation.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-gray-400 text-xs whitespace-nowrap">{new Date(donation.created_at).toLocaleDateString()}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {!donation.is_approved && (
                        <>
                          <button onClick={() => handleApprove(donation.id)} className="text-green-400 hover:text-green-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-green-500/10 transition-colors">Approve</button>
                          <button onClick={() => handleReject(donation.id)} className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Reject</button>
                        </>
                      )}
                      <button onClick={() => openThankYou(donation)} className="text-blue-400 hover:text-blue-300 text-[10px] sm:text-xs font-bold min-h-[32px] sm:min-h-[36px] px-1.5 sm:px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">Thank You</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {donations.length === 0 && (
        <p className="text-gray-400 text-center py-8">No donations found.</p>
      )}

      {showThankYouModal && selectedDonation && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setShowThankYouModal(false)}>
          <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-yellow-400">Send Thank You Message</h3>
                <p className="text-gray-400 text-sm">To: {selectedDonation.user?.full_name || selectedDonation.user?.email}</p>
              </div>
              <button onClick={() => setShowThankYouModal(false)} className="text-gray-400 hover:text-white text-xl p-1">✕</button>
            </div>
            <textarea
              value={thankYouMessage}
              onChange={(e) => setThankYouMessage(e.target.value)}
              rows="8"
              className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white text-sm mb-4"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button onClick={sendThankYou} disabled={sending} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
                {sending ? 'Sending...' : 'Send Message'}
              </button>
              <button onClick={() => setShowThankYouModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-bold transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationManagement;
