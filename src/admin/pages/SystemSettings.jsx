import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState('');
  const token = localStorage.getItem('access_token');

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users/system-settings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/users/system-settings/`, settings, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      alert('Settings saved successfully');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-gray-400">Loading settings...</div>;
  if (!settings) return null;

  const SettingField = ({ label, name, type = 'text', value, onChange, copyable = false }) => {
    const handleCopy = () => {
      if (value && copyable) {
        navigator.clipboard.writeText(value);
        setCopied(`${label} copied`);
        setTimeout(() => setCopied(''), 2000);
      }
    };
    return (
      <div>
        <label className="block text-sm text-gray-400 mb-1">{label}</label>
        <div className="flex items-center gap-2">
          {type === 'textarea' ? (
            <textarea value={value || ''} onChange={(e) => onChange(name, e.target.value)} rows="3" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          ) : (
            <input type={type} value={value || ''} onChange={(e) => onChange(name, e.target.value)} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
          )}
          {copyable && value && (
            <button type="button" onClick={handleCopy} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex-shrink-0">Copy</button>
          )}
        </div>
      </div>
    );
  };

  const handleChange = (name, value) => {
    setSettings({ ...settings, [name]: value });
  };

  return (
    <div>
      {copied && (
        <div className='fixed top-20 right-6 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm'>
          {copied}
        </div>
      )}
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">System Settings</h1>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <SettingField label="Site Name" name="site_name" value={settings.site_name} onChange={handleChange} />
          <SettingField label="Contact Email" name="contact_email" value={settings.contact_email} onChange={handleChange} />
          <SettingField label="Contact Phone" name="contact_phone" value={settings.contact_phone} onChange={handleChange} />
          <SettingField label="Minimum Deposit" name="minimum_deposit" type="number" value={settings.minimum_deposit} onChange={handleChange} />
          <SettingField label="Maximum Deposit" name="maximum_deposit" type="number" value={settings.maximum_deposit} onChange={handleChange} />
          <SettingField label="ROI Percentage" name="roi_percentage" type="number" step="0.01" value={settings.roi_percentage} onChange={handleChange} />
          <SettingField label="Investment Duration (days)" name="investment_duration_days" type="number" value={settings.investment_duration_days} onChange={handleChange} />
          <SettingField label="Payment Wallet Address" name="payment_wallet_address" value={settings.payment_wallet_address} onChange={handleChange} copyable={true} />
          <SettingField label="Crypto Wallet Address" name="crypto_wallet_address" value={settings.crypto_wallet_address} onChange={handleChange} copyable={true} />
          <SettingField label="Supported Cryptocurrencies" name="supported_cryptocurrencies" value={settings.supported_cryptocurrencies} onChange={handleChange} />
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={settings.maintenance_mode} onChange={(e) => handleChange('maintenance_mode', e.target.checked)} />
            <label className="text-gray-300">Maintenance Mode</label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Terms and Conditions</label>
          <textarea value={settings.terms_and_conditions || ''} onChange={(e) => handleChange('terms_and_conditions', e.target.value)} rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
        </div>
        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Privacy Policy</label>
          <textarea value={settings.privacy_policy || ''} onChange={(e) => handleChange('privacy_policy', e.target.value)} rows="4" className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white" />
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;