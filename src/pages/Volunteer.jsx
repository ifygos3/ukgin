import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone_number: '',
    skills: '', availability: 'flexible', areas_of_interest: [], resume: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const areas = ['Events', 'Community Service', 'Education', 'Fundraising', 'Marketing', 'IT', 'Design', 'Writing'];

  const handleAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(area)
        ? prev.areas_of_interest.filter(a => a !== area)
        : [...prev.areas_of_interest, area]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      areas_of_interest: formData.areas_of_interest.join(','),
    };

    try {
      await axios.post(`${API_BASE_URL}/users/public/volunteer-application/`, payload, {
        headers: formData.resume ? { 'Content-Type': 'multipart/form-data' } : {},
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = 'w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors';
  const labelBase = 'block text-sm text-gray-400 mb-1.5 font-medium';

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold text-yellow-400 mb-4">Thank You!</h1>
            <p className="text-gray-300 leading-7 mb-6">
              Your volunteer application has been submitted successfully. Our team will review your application and get back to you within 5-7 business days.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ full_name: '', email: '', phone_number: '', skills: '', availability: 'flexible', areas_of_interest: [], resume: null }); }}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">Volunteer With UKGIN</h1>
        <p className="text-gray-300 text-lg mb-8">
          Make a difference by volunteering your time and skills for the community. Fill out the form below and our team will get in touch with you.
        </p>

        {error && (
          <div className="bg-red-500/15 text-red-300 p-4 rounded-xl mb-6 border border-red-500/20" role="alert">{error}</div>
        )}

        <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vol-name" className={labelBase}>Full Name *</label>
                <input id="vol-name" type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className={inputBase} />
              </div>
              <div>
                <label htmlFor="vol-email" className={labelBase}>Email Address *</label>
                <input id="vol-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputBase} />
              </div>
            </div>
            <div>
              <label htmlFor="vol-phone" className={labelBase}>Phone Number</label>
              <input id="vol-phone" type="text" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} className={inputBase} />
            </div>
            <div>
              <label htmlFor="vol-skills" className={labelBase}>Skills</label>
              <input id="vol-skills" type="text" placeholder="e.g., Event Planning, Writing, Design" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className={inputBase} />
            </div>
            <div>
              <label htmlFor="vol-availability" className={labelBase}>Availability</label>
              <select id="vol-availability" value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className={inputBase}>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label className={labelBase}>Areas of Interest</label>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <label key={area} className="bg-gray-800 px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-700 flex items-center transition-colors">
                    <input
                      type="checkbox"
                      className="mr-2 accent-yellow-400"
                      checked={formData.areas_of_interest.includes(area)}
                      onChange={() => handleAreaToggle(area)}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="vol-resume" className={labelBase}>Resume (optional)</label>
              <input id="vol-resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })} className={inputBase} />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Volunteer Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
