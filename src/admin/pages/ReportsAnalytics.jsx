import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ReportsAnalytics = () => {
  const [reportType, setReportType] = useState('daily');
  const [exportFormat, setExportFormat] = useState('json');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('access_token');

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('type', reportType);
      params.set('format', exportFormat);
      const res = await axios.get(`${API_BASE_URL}/users/export/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Reports & Analytics</h1>
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 mb-8">
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Generate Report</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Export Format</label>
            <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="w-full bg-black p-3 rounded-xl border border-gray-700 text-white">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>
        <button onClick={generateReport} disabled={loading} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
      {reportData && (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Report Results</h2>
          <pre className="text-gray-300 text-sm overflow-auto">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;