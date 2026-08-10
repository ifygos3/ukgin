import { useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { EmptyState } from '../components/ui';

const PaymentEvidence = () => {
  const { user } = useAuth();
  const [type, setType] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const endpoint = useMemo(() => (type === 'deposit' ? 'http://127.0.0.1:8000/users/deposits/' : 'http://127.0.0.1:8000/users/donations/'), [type]);
  const token = localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!amount || !file) {
      setMessage({ type: 'error', text: 'Please enter an amount and choose a file before submitting.' });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('payment_method', paymentMethod);
    formData.append('notes', notes);
    formData.append('transaction_reference', `${type.toUpperCase()}-${Date.now()}`);
    if (type === 'deposit') {
      formData.append('proof_of_payment', file);
    } else {
      formData.append('proof_of_donation', file);
    }

    try {
      await axios.post(endpoint, formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({
        type: 'success',
        text: `${type === 'deposit' ? 'Deposit' : 'Donation'} evidence uploaded successfully.`,
      });
      setAmount('');
      setPaymentMethod('bank_transfer');
      setNotes('');
      setFile(null);
      e.target.reset();
    } catch (error) {
      if (error.response?.data?.detail) {
        setMessage({ type: 'error', text: error.response.data.detail });
      } else {
        setMessage({ type: 'error', text: 'Unable to upload evidence right now. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full rounded-xl border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-yellow-400 transition-colors';
  const labelBase = 'block text-sm text-gray-400 mb-1.5 font-medium';

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-800 shadow-2xl p-8 md:p-10">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-bold">Proof of donation</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">Share proof of your donation</h1>
            <p className="text-gray-400 mt-3 leading-7">Upload a screenshot, image, or PDF so your proof of donation is attached to your submission.</p>
          </div>

          {message.text && (
            <div className={`mb-6 rounded-xl border px-4 py-3 ${message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300'}`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelBase}>What are you uploading?</label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setType('deposit')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${type === 'deposit' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Payment proof
                </button>
                <button
                  type="button"
                  onClick={() => setType('donation')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${type === 'donation' ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  Donation proof
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="ev-amount" className={labelBase}>Amount</label>
              <input id="ev-amount" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className={inputBase} required />
            </div>

            <div>
              <label htmlFor="ev-method" className={labelBase}>Payment method</label>
              <select id="ev-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputBase}>
                <option value="bank_transfer">Bank transfer</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="card_payment">Card payment</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="ev-file" className={labelBase}>Upload proof</label>
              <input id="ev-file" type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className={inputBase} />
              <p className="mt-2 text-sm text-gray-500">Accepted formats: JPG, PNG, PDF, and other image files.</p>
            </div>

            <div>
              <label htmlFor="ev-notes" className={labelBase}>Notes (optional)</label>
              <textarea id="ev-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="4" placeholder="Add any extra information for the admin team." className={`${inputBase} resize-none`} />
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-400">
              <p><span className="font-semibold text-white">Logged in as:</span> {user?.full_name || user?.username || 'Guest'}</p>
              <p className="mt-1">Your proof will be attached to the selected record and reviewed by the admin team.</p>
            </div>

            <button type="submit" disabled={loading} className={`w-full rounded-xl bg-yellow-400 px-4 py-3 font-semibold text-gray-900 transition hover:bg-yellow-300 ${loading ? 'cursor-not-allowed opacity-70' : ''}`}>
              {loading ? 'Uploading...' : `Upload ${type === 'deposit' ? 'payment' : 'donation'} proof`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentEvidence;
