import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const KYCVerification = () => {
  const [kycDocs, setKycDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const token = localStorage.getItem('access_token');

  const fetchKYC = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'pending') params.set('status', 'pending');
      else if (filter === 'approved') params.set('status', 'approved');
      else if (filter === 'rejected') params.set('status', 'rejected');
      const res = await axios.get(`${API_BASE_URL}/users/kyc/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycDocs(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchKYC(); }, [filter]);

  const handleApprove = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/kyc/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKYC();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/kyc/${id}/reject/`, { reason: 'Document does not meet requirements' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKYC();
    } catch (err) { console.error(err); }
  };

  const handleResubmit = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/users/kyc/${id}/request-resubmission/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKYC();
    } catch (err) { console.error(err); }
  };

  const typeBadge = (type) => {
    const colors = { id_card: 'bg-blue-500/20 text-blue-300', passport: 'bg-green-500/20 text-green-300', selfie: 'bg-purple-500/20 text-purple-300' };
    return <span className={`px-2 py-1 rounded text-xs ${colors[type] || 'bg-gray-500/20 text-gray-300'}`}>{type}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">KYC Verification</h1>
      <div className="flex gap-4 mb-6">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filter === f ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kycDocs.map((doc) => (
          <div key={doc.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-3">
              <span className="text-white font-bold">{doc.user?.full_name}</span>
              {typeBadge(doc.document_type)}
            </div>
            {doc.document_file_url && (
              <a href={doc.document_file_url} target="_blank" rel="noopener noreferrer" className="block mb-3 text-blue-400 hover:text-blue-300 text-sm underline">
                View Document
              </a>
            )}
            <div className="flex gap-2 flex-wrap">
              {!doc.is_verified && (
                <>
                  <button onClick={() => handleApprove(doc.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-bold">Approve</button>
                  <button onClick={() => handleReject(doc.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold">Reject</button>
                  <button onClick={() => handleResubmit(doc.id)} className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-xs font-bold">Resubmit</button>
                </>
              )}
              {doc.is_verified && <span className="text-green-400 text-xs font-bold">Verified</span>}
              {doc.rejection_reason && <span className="text-red-400 text-xs">{doc.rejection_reason}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCVerification;