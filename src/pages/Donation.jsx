import { useState, useEffect } from 'react';
import axios from 'axios';

const Donation = () => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [cryptoType, setCryptoType] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [settings, setSettings] = useState(null);
  const [uploadedProofUrl, setUploadedProofUrl] = useState('');
  const token = localStorage.getItem('access_token');

  const presetAmounts = [5, 10, 15, 20, 25, 30, 40, 50, 70, 100, 120, 130, 150, 200, 250, 300, 350, 400, 450, 500];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/users/system-settings/');
        setSettings(res.data);
      } catch {
        setSettings({
          bank_name: 'GTBANK Nigeria',
          account_name: 'Levison High-Tech Company Limited',
          account_number: '3004132833',
          btc_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          eth_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          usdt_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          bnb_address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          sol_address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          crypto_wallet_address: '',
          card_payment_enabled: true,
          card_payment_provider: 'Paystack/Stripe',
        });
      }
    };
    fetchSettings();
  }, []);

  const getCryptoAddress = (type) => {
    if (!settings) return '';
    const key = type.toLowerCase();
    if (key === 'bitcoin') return settings.btc_address || settings.crypto_wallet_address || '';
    if (key === 'ethereum') return settings.eth_address || '';
    if (key === 'usdt') return settings.usdt_address || '';
    if (key === 'bnb') return settings.bnb_address || '';
    if (key === 'solana') return settings.sol_address || '';
    return settings.crypto_wallet_address || '';
  };

  const currentCryptoAddress = cryptoType ? getCryptoAddress(cryptoType) : '';

  const copyToClipboard = (text, label = 'Copied') => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleAmountSelect = (value) => {
    if (value === 'Custom') {
      setAmount('');
      setCustomAmount('');
      setShowForm(true);
    } else {
      setAmount(value);
      setCustomAmount('');
      setShowForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const submitData = new FormData();
    submitData.append('amount', amount || customAmount);
    submitData.append('payment_method', paymentMethod);
    submitData.append('bank_name', bankName || settings?.bank_name || '');
    submitData.append('account_number', accountNumber || settings?.account_number || '');
    submitData.append('account_name', accountName || settings?.account_name || '');
    submitData.append('crypto_type', cryptoType);
    submitData.append('wallet_address', walletAddress || currentCryptoAddress);
    submitData.append('notes', notes);
    submitData.append('is_anonymous', isAnonymous);
    submitData.append('card_type', paymentMethod === 'card_payment' ? 'card' : '');
    submitData.append('card_last_four', cardNumber.slice(-4));
    submitData.append('card_holder', cardHolder);
    submitData.append('card_expiry', cardExpiry);
    submitData.append('transaction_reference', `DON-${Date.now()}`);
    if (proofFile) submitData.append('proof_of_donation', proofFile);

    try {
      await axios.post('http://127.0.0.1:8000/users/donations/', submitData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axios.post('http://127.0.0.1:8000/users/donations/', submitData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      });

      const proofUrl = response?.data?.proof_of_donation_url || (proofFile ? URL.createObjectURL(proofFile) : '');
      setUploadedProofUrl(proofUrl);
      setMessage({ type: 'success', text: 'Donation submitted successfully! Your proof of donation is ready below.' });
      setAmount('');
      setCustomAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      setCryptoType('');
      setWalletAddress('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVV('');
      setCardHolder('');
      setNotes('');
      setProofFile(null);
      setDonorName('');
      setDonorEmail('');
      setShowForm(false);
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) setMessage({ type: 'error', text: 'Please fill in all required fields.' });
        else if (data.detail) setMessage({ type: 'error', text: data.detail });
        else setMessage({ type: 'error', text: 'Donation failed. Please try again.' });
      } else {
        setMessage({ type: 'error', text: 'Cannot connect to server. Please check your internet connection.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      {copied && (
        <div className='fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-sm transition-opacity duration-300'>
          {copied}
        </div>
      )}
      <div className='max-w-4xl mx-auto'>
        {!showForm ? (
          <div className='bg-gray-900 rounded-3xl p-12 text-center'>
            <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Support UKGIN</h1>
            <p className='text-gray-300 leading-8 text-lg'>Your support helps empower youths, preserve Igbo culture and build economic opportunities.</p>
            <div className='flex flex-wrap justify-center gap-5 mt-10'>
              {presetAmounts.map((value) => (
                <button key={value} onClick={() => handleAmountSelect(value)} className='bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold transition-colors'>
                  ${value}
                </button>
              ))}
              <button onClick={() => handleAmountSelect('Custom')} className='bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-full font-bold transition-colors'>
                Custom
              </button>
            </div>

            <div className='mt-12 grid md:grid-cols-2 gap-6 text-left'>
                  <div className='bg-gray-800 p-6 rounded-2xl'>
                    <h3 className='text-xl font-bold text-white mb-3'>Bank Transfer</h3>
                    <p className='text-gray-300 text-sm mb-1 font-semibold'>{settings?.bank_name || 'GTBANK Nigeria'}</p>
                    <p className='text-gray-300 text-sm mb-1'>Account: {settings?.account_name || 'Levison High-Tech Company Limited'}</p>
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-300 text-sm'>Number:</span>
                      <code className='text-yellow-400 font-mono text-sm bg-black/50 px-2 py-1 rounded flex-1'>{settings?.account_number || '3004132833'}</code>
                      <button type='button' onClick={() => copyToClipboard(settings?.account_number || '3004132833', 'Account number copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                    </div>
                  </div>

              <div className='bg-gray-800 p-6 rounded-2xl'>
                <h3 className='text-xl font-bold text-white mb-3'>Cryptocurrency</h3>
                <p className='text-gray-400 text-sm mb-2'>Send crypto to the address below for your chosen coin.</p>
                <div className='space-y-2 text-sm'>
                   {settings?.btc_address &&                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>BTC: </span>
                    <code className='text-gray-200 break-all flex-1 bg-black/50 px-2 py-1 rounded text-xs'>{settings.btc_address}</code>
                    <button type='button' onClick={() => copyToClipboard(settings.btc_address, 'BTC address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                  </div>}
                   {settings?.eth_address &&                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>ETH: </span>
                    <code className='text-gray-200 break-all flex-1 bg-black/50 px-2 py-1 rounded text-xs'>{settings.eth_address}</code>
                    <button type='button' onClick={() => copyToClipboard(settings.eth_address, 'ETH address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                  </div>}
                   {settings?.usdt_address &&                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>USDT: </span>
                    <code className='text-gray-200 break-all flex-1 bg-black/50 px-2 py-1 rounded text-xs'>{settings.usdt_address}</code>
                    <button type='button' onClick={() => copyToClipboard(settings.usdt_address, 'USDT address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                  </div>}
                   {settings?.bnb_address &&                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>BNB: </span>
                    <code className='text-gray-200 break-all flex-1 bg-black/50 px-2 py-1 rounded text-xs'>{settings.bnb_address}</code>
                    <button type='button' onClick={() => copyToClipboard(settings.bnb_address, 'BNB address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                  </div>}
                   {settings?.sol_address &&                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>SOL: </span>
                    <code className='text-gray-200 break-all flex-1 bg-black/50 px-2 py-1 rounded text-xs'>{settings.sol_address}</code>
                    <button type='button' onClick={() => copyToClipboard(settings.sol_address, 'SOL address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                  </div>}
                  {!settings?.btc_address && !settings?.eth_address && !settings?.usdt_address && !settings?.bnb_address && !settings?.sol_address && <p className='text-gray-500'>Crypto addresses not configured yet. Please use bank transfer or card.</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className='bg-gray-900 p-10 rounded-3xl'>
            <h1 className='text-3xl font-bold text-yellow-400 text-center mb-2'>Make a Donation</h1>
            <p className='text-center text-gray-400 mb-6'>Amount: <span className='text-yellow-400 font-bold'>${amount || customAmount}</span></p>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{message.text}</div>
            )}

            {uploadedProofUrl && (
              <div className='mb-6 rounded-2xl border border-yellow-400/30 bg-black/30 p-4'>
                <h3 className='text-lg font-bold text-yellow-400 mb-3'>Your proof of donation</h3>
                {uploadedProofUrl.match(/\.(png|jpe?g|gif|webp|svg)$/i) ? (
                  <img src={uploadedProofUrl} alt='Uploaded donation proof' className='max-h-72 rounded-xl border border-gray-700 object-contain' />
                ) : (
                  <a href={uploadedProofUrl} target='_blank' rel='noreferrer' className='text-yellow-400 underline'>Open uploaded proof</a>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white'>
                  <option value='bank_transfer'>Bank Transfer</option>
                  <option value='crypto'>Cryptocurrency</option>
                  <option value='card_payment'>Credit/Debit Card</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <>
                  <div className='bg-gray-800 p-4 rounded-xl'>
                    <p className='text-gray-400 text-sm mb-1 font-semibold'>{settings?.bank_name || 'GTBANK Nigeria'}</p>
                    <p className='text-gray-300 text-sm mb-1'>Account: {settings?.account_name || 'Levison High-Tech Company Limited'}</p>
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-300 text-sm'>Number:</span>
                      <code className='text-yellow-400 font-mono text-sm bg-black/50 px-2 py-1 rounded flex-1'>{settings?.account_number || '3004132833'}</code>
                      <button type='button' onClick={() => copyToClipboard(settings?.account_number || '3004132833', 'Copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0'>Copy</button>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Sender Account Number</label>
                    <input type='text' value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder='Your Account Number' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Sender Bank Name</label>
                    <input type='text' value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder='Your Bank Name' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Sender Account Name</label>
                    <input type='text' value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder='Your Account Name' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                </>
              )}

              {paymentMethod === 'crypto' && (
                <>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Cryptocurrency</label>
                    <select value={cryptoType} onChange={(e) => setCryptoType(e.target.value)} className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white'>
                      <option value=''>Select Cryptocurrency</option>
                      <option value='Bitcoin'>Bitcoin (BTC)</option>
                      <option value='Ethereum'>Ethereum (ETH)</option>
                      <option value='USDT'>Tether (USDT)</option>
                      <option value='BNB'>BNB</option>
                      <option value='Solana'>Solana (SOL)</option>
                    </select>
                  </div>
                  {currentCryptoAddress && (
                    <div className='bg-gray-800 p-4 rounded-xl'>
                      <p className='text-gray-400 text-sm mb-2'>Send to:</p>
                      <p className='text-gray-200 font-mono text-sm break-all bg-black/50 px-2 py-1 rounded'>{currentCryptoAddress}</p>
                      <button type='button' onClick={() => copyToClipboard(currentCryptoAddress, 'Address copied')} className='bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg text-xs font-bold transition-colors mt-3'>Copy Address</button>
                    </div>
                  )}
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Sender Wallet Address (optional)</label>
                    <input type='text' value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder='Your wallet/tx hash' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                </>
              )}

              {paymentMethod === 'card_payment' && (
                <>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Card Number</label>
                    <input type='text' value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder='1234 5678 9012 3456' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm text-gray-400 mb-1'>Expiry (MM/YY)</label>
                      <input type='text' value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder='MM/YY' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
                    </div>
                    <div>
                      <label className='block text-sm text-gray-400 mb-1'>CVV</label>
                      <input type='text' value={cardCVV} onChange={(e) => setCardCVV(e.target.value)} placeholder='123' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm text-gray-400 mb-1'>Cardholder Name</label>
                    <input type='text' value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder='Name on card' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
                  </div>
                  <p className='text-gray-500 text-xs'>Card details are processed securely by {settings?.card_payment_provider || 'our payment processor'}. Only the last 4 digits are saved for verification.</p>
                </>
              )}

              {!token && (
                <>
                  <div>
                    <input type='text' value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder='Your Name (optional for anonymous)' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                  <div>
                    <input type='email' value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder='Your Email (optional)' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                  </div>
                  <label className='flex items-center gap-2 text-gray-300'>
                    <input type='checkbox' checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                    Donate anonymously
                  </label>
                </>
              )}

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Proof of Donation</label>
                <input type='file' accept='image/*,.pdf' onChange={(e) => setProofFile(e.target.files[0])} className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
                <p className='text-xs text-gray-500 mt-2'>Upload a screenshot or PDF so your proof of donation appears right after submission.</p>
              </div>

              <div>
                <label className='block text-sm text-gray-400 mb-1'>Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder='Add a note (optional)' rows='3' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
              </div>

              <button type='submit' disabled={loading} className={`sticky bottom-4 z-50 w-full bg-yellow-400 text-gray-900 p-4 rounded-xl font-bold transition-colors hover:bg-yellow-500 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? 'Submitting Donation...' : 'Submit Donation'}
              </button>

              <button type='button' onClick={() => setShowForm(false)} className='w-full bg-gray-700 text-white p-4 rounded-xl font-bold hover:bg-gray-600 transition-colors'>
                Back to Amounts
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donation;
