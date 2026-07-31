import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const Signup = ({ showNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    phone_number: '',
    country: '',
    state_of_origin: '',
    state_of_residence: '',
    lga: '',
    community: '',
    place_of_birth: '',
    sex: '',
    highest_qualification: '',
    institution_attended: '',
    year_of_graduation: '',
    profession: '',
    current_job: '',
    job_title: '',
    job_experience: '',
    current_employee: '',
    about_user: '',
    username: '',
    password: '',
    confirmPassword: '',
    signature_data: '',
  });
  const [countryId, setCountryId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const NIGERIAN_STATES = [
    'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Benue',
    'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
    'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
    'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ogun',
    'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
    'Yobe', 'Zamfara',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleCountrySelect = (e) => {
    const country = e.target.value;
    const id = country === 'Nigeria' ? 1 : country === 'Ghana' ? 2 : 0;
    setCountryId(id);
    setFormData(prev => ({ ...prev, country, state_of_origin: '' }));
  };

  const handleSignature = (dataUrl) => {
    setFormData(prev => ({ ...prev, signature_data: dataUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setErrors({});

    const nameParts = formData.full_name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const submitData = {
      ...formData,
      first_name: firstName,
      last_name: lastName,
      confirmPassword: formData.confirmPassword || undefined,
    };

    try {
      await axios.post(
        `${API_BASE_URL}/users/create_user/`,
        submitData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage({ type: 'success', text: 'Registration successful! Welcome to the community.' });
      showNotification?.('Signup successful. Please login to continue.', 'success');

      setFormData({
        full_name: '', email: '', address: '', phone_number: '',
        country: '', state_of_origin: '', state_of_residence: '', lga: '', community: '',
        place_of_birth: '', sex: '', highest_qualification: '',
        institution_attended: '', year_of_graduation: '', profession: '',
        current_job: '', job_title: '', job_experience: '',
        current_employee: '', about_user: '',
        first_name: '', last_name: '', username: '',
        password: '', confirmPassword: '', signature_data: '',
      });
      setCountryId(0);

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        if (data.errors) setErrors(data.errors);
        else if (data.detail) setMessage({ type: 'error', text: data.detail });
        else setMessage({ type: 'error', text: 'Registration failed. Please check your input.' });
      } else if (error.request) {
        setMessage({ type: 'error', text: 'Cannot connect to server. Please check your internet connection.' });
        showNotification?.('Cannot connect to server. Please check your internet connection.', 'error');
      } else {
        setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        showNotification?.('An error occurred. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pt-32 px-6 md:px-20'>
      <div className='max-w-4xl mx-auto bg-gray-900 p-10 rounded-3xl'>
        <h1 className='text-5xl font-bold text-yellow-400 text-center mb-10'>Membership Registration</h1>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-6'>
          <h2 className='md:col-span-2 text-xl font-bold text-yellow-400 mb-2'>SECTION 1: APPLICANT INFORMATION</h2>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Full Name *</label>
            <input type='text' name='full_name' value={formData.full_name} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.full_name && <span className="text-red-400 text-sm">{errors.full_name}</span>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Address *</label>
            <input type='text' name='address' value={formData.address} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.address && <span className="text-red-400 text-sm">{errors.address}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email Address *</label>
            <input type='email' name='email' value={formData.email} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.email && <span className="text-red-400 text-sm">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone Number *</label>
            <input type='text' name='phone_number' value={formData.phone_number} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.phone_number && <span className="text-red-400 text-sm">{errors.phone_number}</span>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Country *</label>
            <select name='country' value={formData.country} onChange={handleCountrySelect} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required>
              <option value=''>Select Country</option>
              <option value='Nigeria'>Nigeria</option>
              <option value='Ghana'>Ghana</option>
              <option value='United Kingdom'>United Kingdom</option>
              <option value='United States'>United States</option>
              <option value='Canada'>Canada</option>
              <option value='Australia'>Australia</option>
              <option value='South Africa'>South Africa</option>
            </select>
            {errors.country && <span className="text-red-400 text-sm">{errors.country}</span>}
          </div>

          {countryId > 0 && (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">State Chapter (State of Origin) *</label>
              <select name='state_of_origin' value={formData.state_of_origin} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required>
                <option value=''>Select State Chapter</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state_of_origin && <span className="text-red-400 text-sm">{errors.state_of_origin}</span>}
            </div>
          )}

          {countryId === 0 && formData.country && (
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">State Chapter (State of Origin) *</label>
              <input type='text' name='state_of_origin' value={formData.state_of_origin} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
              {errors.state_of_origin && <span className="text-red-400 text-sm">{errors.state_of_origin}</span>}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">State of Residence *</label>
            <select name='state_of_residence' value={formData.state_of_residence} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required>
              <option value=''>Select State of Residence</option>
              {countryId > 0 && NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state_of_residence && <span className="text-red-400 text-sm">{errors.state_of_residence}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Local Government Area (LGA) *</label>
            <input type='text' name='lga' value={formData.lga} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.lga && <span className="text-red-400 text-sm">{errors.lga}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Community</label>
            <input type='text' name='community' value={formData.community} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Place of Birth *</label>
            <input type='text' name='place_of_birth' value={formData.place_of_birth} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.place_of_birth && <span className="text-red-400 text-sm">{errors.place_of_birth}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Sex *</label>
            <select name='sex' value={formData.sex} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required>
              <option value=''>Select Sex</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
            {errors.sex && <span className="text-red-400 text-sm">{errors.sex}</span>}
          </div>

          <h2 className='md:col-span-2 text-xl font-bold text-yellow-400 mt-4 mb-2'>SECTION 2: EDUCATIONAL BACKGROUND</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Highest Qualification *</label>
            <input type='text' name='highest_qualification' value={formData.highest_qualification} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.highest_qualification && <span className="text-red-400 text-sm">{errors.highest_qualification}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Institution Attended *</label>
            <input type='text' name='institution_attended' value={formData.institution_attended} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.institution_attended && <span className="text-red-400 text-sm">{errors.institution_attended}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Year of Graduation *</label>
            <input type='text' name='year_of_graduation' value={formData.year_of_graduation} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.year_of_graduation && <span className="text-red-400 text-sm">{errors.year_of_graduation}</span>}
          </div>

          <h2 className='md:col-span-2 text-xl font-bold text-yellow-400 mt-4 mb-2'>SECTION 3: PROFESSION BACKGROUND</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Profession *</label>
            <input type='text' name='profession' value={formData.profession} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.profession && <span className="text-red-400 text-sm">{errors.profession}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Job Title *</label>
            <input type='text' name='job_title' value={formData.job_title} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.job_title && <span className="text-red-400 text-sm">{errors.job_title}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Job *</label>
            <input type='text' name='current_job' value={formData.current_job} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.current_job && <span className="text-red-400 text-sm">{errors.current_job}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Employer *</label>
            <input type='text' name='current_employee' value={formData.current_employee} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.current_employee && <span className="text-red-400 text-sm">{errors.current_employee}</span>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Job Experience *</label>
            <textarea name='job_experience' value={formData.job_experience} onChange={handleChange} rows='4' className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.job_experience && <span className="text-red-400 text-sm">{errors.job_experience}</span>}
          </div>

          <h2 className='md:col-span-2 text-xl font-bold text-yellow-400 mt-4 mb-2'>ACCOUNT SETUP</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Username *</label>
            <input type='text' name='username' value={formData.username} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white' required />
            {errors.username && <span className="text-red-400 text-sm">{errors.username}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password *</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} name='password' value={formData.password} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white pr-10' required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="text-red-400 text-sm">{errors.password}</span>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password *</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className='bg-black p-4 rounded-xl w-full border border-gray-700 text-white pr-10' required />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm">
                {showConfirmPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-red-400 text-sm">{errors.confirmPassword}</span>}
          </div>

          <h2 className='md:col-span-2 text-xl font-bold text-yellow-400 mt-4 mb-2'>SIGNATURE</h2>

          <div className="md:col-span-2">
            <SignaturePad onSignature={handleSignature} />
            {errors.signature_data && <span className="text-red-400 text-sm">{errors.signature_data}</span>}
          </div>

          <div className="flex gap-4 col-span-full mt-6">
            <button type='submit' disabled={loading} className={`flex-1 bg-yellow-400 text-gray-900 p-4 rounded-xl font-bold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-500'}`}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button type='button' onClick={() => navigate('/')} className="flex-1 bg-gray-700 text-white p-4 rounded-xl font-bold transition-colors hover:bg-gray-600">
              Return to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignaturePad = ({ onSignature }) => {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasSignature, setHasSignature] = React.useState(false);

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '200px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  React.useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.touchAction = 'none';
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

   const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) canvas.style.touchAction = 'auto';
    setHasSignature(true);
    const dataUrl = canvas.toDataURL('image/png');
    onSignature(dataUrl);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.touchAction = 'auto';
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    onSignature('');
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="bg-white border border-gray-600 rounded-xl w-full cursor-crosshair"
        style={{ height: '200px' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="flex gap-3 mt-2">
        <button type="button" onClick={clearSignature} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Clear</button>
        {hasSignature && <span className="text-green-400 text-sm mt-1">Signature captured</span>}
      </div>
    </div>
  );
};

export default Signup;