import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WalletManagement = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [debitAmount, setDebitAmount] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem('access_token');

  const fetchWallets = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/users/wallets/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallets(res.data.results || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWallets(); }, []);

  const handleCredit = async (walletId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/wallets/${walletId}/credit/`, { amount: creditAmount, description }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setCreditAmount('');
      setDescription('');
      fetchWallets();
    } catch (err) { console.error(err); }
  };

  const handleDebit = async (walletId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/wallets/${walletId}/debit/`, { amount: debitAmount, description }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setDebitAmount('');
      setDescription('');
      fetchWallets();
    } catch (err) { console.error(err); }
  };

  const handleFreeze = async (walletId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/wallets/${walletId}/freeze/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWallets();
    } catch (err) { console.error(err); }
  };

  const handleUnfreeze = async (walletId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/users/wallets/${walletId}/unfreeze/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWallets();
    } catch (err) { console.error(err); }
  };

  const viewTransactions = async (walletId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/users/wallet-transactions/?wallet_id=${walletId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.results || res.data);
      setShowTransactions(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Wallet Management</h1>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">User</th>
              <th className="text-left p-3 text-gray-400">Balance</th>
              <th className="text-left p-3 text-gray-400">Status</th>
              <th className="text-left p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3">{wallet.user?.full_name}</td>
                <td className="p-3 text-yellow-400 font-bold">${wallet.balance}</td>
                <td className="p-3">{wallet.is_frozen ? <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">Frozen</span> : <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Active</span>}</td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => viewTransactions(wallet.id)} className="text-blue-400 hover:text-blue-300 text-xs">Transactions</button>
                    <button onClick={() => handleFreeze(wallet.id)} className="text-red-400 hover:text-red-300 text-xs">Freeze</button>
                    <button onClick={() => handleUnfreeze(wallet.id)} className="text-green-400 hover:text-green-300 text-xs">Unfreeze</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Credit/Debit Wallet</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} placeholder="Credit Amount" className="bg-black p-3 rounded-xl border border-gray-700 text-white" />
          <input type="number" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} placeholder="Debit Amount" className="bg-black p-3 rounded-xl border border-gray-700 text-white" />
        </div>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white mb-4" />
        <div className="flex gap-4">
          <button onClick={() => { const id = prompt('Enter wallet ID to credit:'); if (id) handleCredit(id); }} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold">Credit</button>
          <button onClick={() => { const id = prompt('Enter wallet ID to debit:'); if (id) handleDebit(id); }} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold">Debit</button>
        </div>
      </div>
      {showTransactions && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Wallet Transactions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-3 text-gray-400">Type</th>
                <th className="text-left p-3 text-gray-400">Amount</th>
                <th className="text-left p-3 text-gray-400">Description</th>
                <th className="text-left p-3 text-gray-400">Reference</th>
                <th className="text-left p-3 text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-800/50">
                  <td className={`p-3 ${tx.transaction_type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>{tx.transaction_type}</td>
                  <td className="p-3">${tx.amount}</td>
                  <td className="p-3 text-gray-400">{tx.description}</td>
                  <td className="p-3 text-gray-400 text-xs">{tx.reference}</td>
                  <td className="p-3 text-gray-400 text-xs">{new Date(tx.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowTransactions(false)} className="mt-4 text-gray-400 hover:text-white text-sm">Close</button>
        </div>
      )}
    </div>
  );
};

export default WalletManagement;