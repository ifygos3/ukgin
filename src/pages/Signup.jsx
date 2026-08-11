import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const NIGERIAN_STATES = [
  'Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const Signup = ({ showNotification }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', email: '', address: '', phone_number: '',
    country: '', state_of_origin: '', lga: '', community: '',
    place_of_birth: '', sex: '', highest_qualification: '',
    institution_attended: '', year_of_graduation: '', profession: '',
    current_job: '', job_title: '', job_experience: '',
    current_employee: '', about_user: '',
    username: '', password: '', confirmPassword: '', signature_data: '',
  });
  const [countryId, setCountryId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSignature = useCallback((dataUrl) => {
    setFormData(prev => ({ ...prev, signature_data: dataUrl }));
  }, []);

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
      frontend_url: window.location.origin,
    };

    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/create_user/`,
        submitData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const emailSent = res.data?.email_verification_sent !== false;
      const emailMessage = res.data?.email_verification_message || 'Please check your email (and spam/junk folder) to verify your account.';

      if (emailSent) {
        setMessage({ type: 'success', text: `Registration successful! ${emailMessage}` });
        showNotification?.(`Signup successful. ${emailMessage}`, 'success');
      } else {
        setMessage({ type: 'warning', text: `Account created, but ${emailMessage}` });
        showNotification?.(`Account created. ${emailMessage}`, 'warning');
      }

      setFormData({
        full_name: '', email: '', address: '', phone_number: '',
        country: '', state_of_origin: '', lga: '', community: '',
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
      let errorMessage = 'Registration failed. Please check your input.';
      if (error.response) {
        const { data } = error.response;
        if (data && typeof data === 'object') {
          const entries = Object.entries(data).filter(([k]) => k !== 'detail');
          if (entries.length) {
            errorMessage = entries.map(([, v]) => Array.isArray(v) ? v.join(' ') : String(v)).join('; ');
            const [firstKey, firstVal] = entries[0];
            setErrors(prev => ({ ...prev, [firstKey]: Array.isArray(firstVal) ? firstVal.join(' ') : String(firstVal) }));
          } else if (data.detail) {
            errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
          }
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your internet connection.';
      }
      setMessage({ type: 'error', text: errorMessage });
      showNotification?.(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full bg-black p-3.5 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none transition-colors';
  const labelBase = 'block text-sm text-gray-400 mb-1.5 font-medium';

  return (
    <div className='min-h-screen pt-24 pb-12 px-4 sm:px-6'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl sm:text-5xl font-bold text-yellow-400 text-center mb-8 sm:mb-10'>Membership Registration</h1>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-500/15 text-green-300 border-green-500/20' : 'bg-red-500/15 text-red-300 border-red-500/20'}`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className='bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl space-y-8'>
          <fieldset className='space-y-4'>
            <legend className='text-lg sm:text-xl font-bold text-yellow-400 mb-3'>SECTION 1: APPLICANT INFORMATION</legend>
            <div>
              <label htmlFor="full_name" className={labelBase}>Full Name *</label>
              <input id="full_name" type='text' name='full_name' value={formData.full_name} onChange={handleChange} className={inputBase} required />
              {errors.full_name && <span className="text-red-400 text-sm mt-1 block">{errors.full_name}</span>}
            </div>
            <div>
              <label htmlFor="address" className={labelBase}>Address *</label>
              <input id="address" type='text' name='address' value={formData.address} onChange={handleChange} className={inputBase} required />
              {errors.address && <span className="text-red-400 text-sm mt-1 block">{errors.address}</span>}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="email" className={labelBase}>Email Address *</label>
                <input id="email" type='email' name='email' value={formData.email} onChange={handleChange} className={inputBase} required />
                {errors.email && <span className="text-red-400 text-sm mt-1 block">{errors.email}</span>}
              </div>
              <div>
                <label htmlFor="phone_number" className={labelBase}>Phone Number *</label>
                <input id="phone_number" type='text' name='phone_number' value={formData.phone_number} onChange={handleChange} className={inputBase} required />
                {errors.phone_number && <span className="text-red-400 text-sm mt-1 block">{errors.phone_number}</span>}
              </div>
            </div>
           <div>
  <label htmlFor="country" className={labelBase}>Country of Residence *</label>
  <select id="country" name='country' value={formData.country} onChange={handleCountrySelect} className={inputBase} required>
    <option value=''>Select Country</option>
    <option value='Afghanistan'>Afghanistan</option>
    <option value='Albania'>Albania</option>
    <option value='Algeria'>Algeria</option>
    <option value='Andorra'>Andorra</option>
    <option value='Angola'>Angola</option>
    <option value='Antigua and Barbuda'>Antigua and Barbuda</option>
    <option value='Argentina'>Argentina</option>
    <option value='Armenia'>Armenia</option>
    <option value='Australia'>Australia</option>
    <option value='Austria'>Austria</option>
    <option value='Azerbaijan'>Azerbaijan</option>
    <option value='Bahamas'>Bahamas</option>
    <option value='Bahrain'>Bahrain</option>
    <option value='Bangladesh'>Bangladesh</option>
    <option value='Barbados'>Barbados</option>
    <option value='Belarus'>Belarus</option>
    <option value='Belgium'>Belgium</option>
    <option value='Belize'>Belize</option>
    <option value='Benin'>Benin</option>
    <option value='Bhutan'>Bhutan</option>
    <option value='Bolivia'>Bolivia</option>
    <option value='Bosnia and Herzegovina'>Bosnia and Herzegovina</option>
    <option value='Botswana'>Botswana</option>
    <option value='Brazil'>Brazil</option>
    <option value='Brunei'>Brunei</option>
    <option value='Bulgaria'>Bulgaria</option>
    <option value='Burkina Faso'>Burkina Faso</option>
    <option value='Burundi'>Burundi</option>
    <option value='Cabo Verde'>Cabo Verde</option>
    <option value='Cambodia'>Cambodia</option>
    <option value='Cameroon'>Cameroon</option>
    <option value='Canada'>Canada</option>
    <option value='Central African Republic'>Central African Republic</option>
    <option value='Chad'>Chad</option>
    <option value='Chile'>Chile</option>
    <option value='China'>China</option>
    <option value='Colombia'>Colombia</option>
    <option value='Comoros'>Comoros</option>
    <option value='Congo'>Congo</option>
    <option value='Costa Rica'>Costa Rica</option>
    <option value='Croatia'>Croatia</option>
    <option value='Cuba'>Cuba</option>
    <option value='Cyprus'>Cyprus</option>
    <option value='Czech Republic'>Czech Republic</option>
    <option value='Denmark'>Denmark</option>
    <option value='Djibouti'>Djibouti</option>
    <option value='Dominica'>Dominica</option>
    <option value='Dominican Republic'>Dominican Republic</option>
    <option value='Ecuador'>Ecuador</option>
    <option value='Egypt'>Egypt</option>
    <option value='El Salvador'>El Salvador</option>
    <option value='Equatorial Guinea'>Equatorial Guinea</option>
    <option value='Eritrea'>Eritrea</option>
    <option value='Estonia'>Estonia</option>
    <option value='Eswatini'>Eswatini</option>
    <option value='Ethiopia'>Ethiopia</option>
    <option value='Fiji'>Fiji</option>
    <option value='Finland'>Finland</option>
    <option value='France'>France</option>
    <option value='Gabon'>Gabon</option>
    <option value='Gambia'>Gambia</option>
    <option value='Georgia'>Georgia</option>
    <option value='Germany'>Germany</option>
    <option value='Ghana'>Ghana</option>
    <option value='Greece'>Greece</option>
    <option value='Grenada'>Grenada</option>
    <option value='Guatemala'>Guatemala</option>
    <option value='Guinea'>Guinea</option>
    <option value='Guinea-Bissau'>Guinea-Bissau</option>
    <option value='Guyana'>Guyana</option>
    <option value='Haiti'>Haiti</option>
    <option value='Honduras'>Honduras</option>
    <option value='Hungary'>Hungary</option>
    <option value='Iceland'>Iceland</option>
    <option value='India'>India</option>
    <option value='Indonesia'>Indonesia</option>
    <option value='Iran'>Iran</option>
    <option value='Iraq'>Iraq</option>
    <option value='Ireland'>Ireland</option>
    <option value='Israel'>Israel</option>
    <option value='Italy'>Italy</option>
    <option value='Jamaica'>Jamaica</option>
    <option value='Japan'>Japan</option>
    <option value='Jordan'>Jordan</option>
    <option value='Kazakhstan'>Kazakhstan</option>
    <option value='Kenya'>Kenya</option>
    <option value='Kiribati'>Kiribati</option>
    <option value='Korea, North'>Korea, North</option>
    <option value='Korea, South'>Korea, South</option>
    <option value='Kuwait'>Kuwait</option>
    <option value='Kyrgyzstan'>Kyrgyzstan</option>
    <option value='Laos'>Laos</option>
    <option value='Latvia'>Latvia</option>
    <option value='Lebanon'>Lebanon</option>
    <option value='Lesotho'>Lesotho</option>
    <option value='Liberia'>Liberia</option>
    <option value='Libya'>Libya</option>
    <option value='Liechtenstein'>Liechtenstein</option>
    <option value='Lithuania'>Lithuania</option>
    <option value='Luxembourg'>Luxembourg</option>
    <option value='Madagascar'>Madagascar</option>
    <option value='Malawi'>Malawi</option>
    <option value='Malaysia'>Malaysia</option>
    <option value='Maldives'>Maldives</option>
    <option value='Mali'>Mali</option>
    <option value='Malta'>Malta</option>
    <option value='Marshall Islands'>Marshall Islands</option>
    <option value='Mauritania'>Mauritania</option>
    <option value='Mauritius'>Mauritius</option>
    <option value='Mexico'>Mexico</option>
    <option value='Micronesia'>Micronesia</option>
    <option value='Moldova'>Moldova</option>
    <option value='Monaco'>Monaco</option>
    <option value='Mongolia'>Mongolia</option>
    <option value='Montenegro'>Montenegro</option>
    <option value='Morocco'>Morocco</option>
    <option value='Mozambique'>Mozambique</option>
    <option value='Myanmar'>Myanmar</option>
    <option value='Namibia'>Namibia</option>
    <option value='Nauru'>Nauru</option>
    <option value='Nepal'>Nepal</option>
    <option value='Netherlands'>Netherlands</option>
    <option value='New Zealand'>New Zealand</option>
    <option value='Nicaragua'>Nicaragua</option>
    <option value='Niger'>Niger</option>
    <option value='Nigeria'>Nigeria</option>
    <option value='North Macedonia'>North Macedonia</option>
    <option value='Norway'>Norway</option>
    <option value='Oman'>Oman</option>
    <option value='Pakistan'>Pakistan</option>
    <option value='Palau'>Palau</option>
    <option value='Palestine'>Palestine</option>
    <option value='Panama'>Panama</option>
    <option value='Papua New Guinea'>Papua New Guinea</option>
    <option value='Paraguay'>Paraguay</option>
    <option value='Peru'>Peru</option>
    <option value='Philippines'>Philippines</option>
    <option value='Poland'>Poland</option>
    <option value='Portugal'>Portugal</option>
    <option value='Qatar'>Qatar</option>
    <option value='Romania'>Romania</option>
    <option value='Russia'>Russia</option>
    <option value='Rwanda'>Rwanda</option>
    <option value='Saint Kitts and Nevis'>Saint Kitts and Nevis</option>
    <option value='Saint Lucia'>Saint Lucia</option>
    <option value='Saint Vincent and the Grenadines'>Saint Vincent and the Grenadines</option>
    <option value='Samoa'>Samoa</option>
    <option value='San Marino'>San Marino</option>
    <option value='Sao Tome and Principe'>Sao Tome and Principe</option>
    <option value='Saudi Arabia'>Saudi Arabia</option>
    <option value='Senegal'>Senegal</option>
    <option value='Serbia'>Serbia</option>
    <option value='Seychelles'>Seychelles</option>
    <option value='Sierra Leone'>Sierra Leone</option>
    <option value='Singapore'>Singapore</option>
    <option value='Slovakia'>Slovakia</option>
    <option value='Slovenia'>Slovenia</option>
    <option value='Solomon Islands'>Solomon Islands</option>
    <option value='Somalia'>Somalia</option>
    <option value='South Africa'>South Africa</option>
    <option value='Spain'>Spain</option>
    <option value='Sri Lanka'>Sri Lanka</option>
    <option value='Sudan'>Sudan</option>
    <option value='Suriname'>Suriname</option>
    <option value='Sweden'>Sweden</option>
    <option value='Switzerland'>Switzerland</option>
    <option value='Syria'>Syria</option>
    <option value='Taiwan'>Taiwan</option>
    <option value='Tajikistan'>Tajikistan</option>
    <option value='Tanzania'>Tanzania</option>
    <option value='Thailand'>Thailand</option>
    <option value='Timor-Leste'>Timor-Leste</option>
    <option value='Togo'>Togo</option>
    <option value='Tonga'>Tonga</option>
    <option value='Trinidad and Tobago'>Trinidad and Tobago</option>
    <option value='Tunisia'>Tunisia</option>
    <option value='Turkey'>Turkey</option>
    <option value='Turkmenistan'>Turkmenistan</option>
    <option value='Tuvalu'>Tuvalu</option>
    <option value='Uganda'>Uganda</option>
    <option value='Ukraine'>Ukraine</option>
    <option value='United Arab Emirates'>United Arab Emirates</option>
    <option value='United Kingdom'>United Kingdom</option>
    <option value='United States'>United States</option>
    <option value='Uruguay'>Uruguay</option>
    <option value='Uzbekistan'>Uzbekistan</option>
    <option value='Vanuatu'>Vanuatu</option>
    <option value='Vatican City'>Vatican City</option>
    <option value='Venezuela'>Venezuela</option>
    <option value='Vietnam'>Vietnam</option>
    <option value='Yemen'>Yemen</option>
    <option value='Zambia'>Zambia</option>
    <option value='Zimbabwe'>Zimbabwe</option>
  </select>
  {errors.country && <span className="text-red-400 text-sm mt-1 block">{errors.country}</span>}
</div>

            {countryId > 0 && (
              <div>
                <label htmlFor="state_of_origin" className={labelBase}>State of Origin *</label>
                <select id="state_of_origin" name='state_of_origin' value={formData.state_of_origin} onChange={handleChange} className={inputBase} required>
                  <option value=''>Select State Chapter</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state_of_origin && <span className="text-red-400 text-sm mt-1 block">{errors.state_of_origin}</span>}
              </div>
            )}

            {countryId === 0 && formData.country && (
              <div>
                <label htmlFor="state_of_origin_other" className={labelBase}>State of Origin *</label>
                <input id="state_of_origin_other" type='text' name='state_of_origin' value={formData.state_of_origin} onChange={handleChange} className={inputBase} required />
                {errors.state_of_origin && <span className="text-red-400 text-sm mt-1 block">{errors.state_of_origin}</span>}
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="lga" className={labelBase}>Local Government Area (LGA) *</label>
                <input id="lga" type='text' name='lga' value={formData.lga} onChange={handleChange} className={inputBase} required placeholder='LGA' />
                {errors.lga && <span className="text-red-400 text-sm mt-1 block">{errors.lga}</span>}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="community" className={labelBase}>Community</label>
                <input id="community" type='text' name='community' value={formData.community} onChange={handleChange} className={inputBase} />
              </div>
              <div>
                <label htmlFor="place_of_birth" className={labelBase}>Place of Birth *</label>
                <input id="place_of_birth" type='text' name='place_of_birth' value={formData.place_of_birth} onChange={handleChange} className={inputBase} required />
                {errors.place_of_birth && <span className="text-red-400 text-sm mt-1 block">{errors.place_of_birth}</span>}
              </div>
            </div>

            <div>
              <label htmlFor="sex" className={labelBase}>Sex *</label>
              <select id="sex" name='sex' value={formData.sex} onChange={handleChange} className={inputBase} required>
                <option value=''>Select Sex</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
              {errors.sex && <span className="text-red-400 text-sm mt-1 block">{errors.sex}</span>}
            </div>
          </fieldset>

          <fieldset className='space-y-4'>
            <legend className='text-lg sm:text-xl font-bold text-yellow-400 mb-3'>SECTION 2: EDUCATIONAL BACKGROUND</legend>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="highest_qualification" className={labelBase}>Highest Qualification *</label>
                <input id="highest_qualification" type='text' name='highest_qualification' value={formData.highest_qualification} onChange={handleChange} className={inputBase} required />
                {errors.highest_qualification && <span className="text-red-400 text-sm mt-1 block">{errors.highest_qualification}</span>}
              </div>
              <div>
                <label htmlFor="institution_attended" className={labelBase}>Institution Attended *</label>
                <input id="institution_attended" type='text' name='institution_attended' value={formData.institution_attended} onChange={handleChange} className={inputBase} required />
                {errors.institution_attended && <span className="text-red-400 text-sm mt-1 block">{errors.institution_attended}</span>}
              </div>
            </div>
            <div>
              <label htmlFor="year_of_graduation" className={labelBase}>Year of Graduation *</label>
              <input id="year_of_graduation" type='text' name='year_of_graduation' value={formData.year_of_graduation} onChange={handleChange} className={inputBase} required />
              {errors.year_of_graduation && <span className="text-red-400 text-sm mt-1 block">{errors.year_of_graduation}</span>}
            </div>
          </fieldset>

          <fieldset className='space-y-4'>
            <legend className='text-lg sm:text-xl font-bold text-yellow-400 mb-3'>SECTION 3: PROFESSION BACKGROUND</legend>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="profession" className={labelBase}>Profession *</label>
                <input id="profession" type='text' name='profession' value={formData.profession} onChange={handleChange} className={inputBase} required />
                {errors.profession && <span className="text-red-400 text-sm mt-1 block">{errors.profession}</span>}
              </div>
              <div>
                <label htmlFor="job_title" className={labelBase}>Current Job Title *</label>
                <input id="job_title" type='text' name='job_title' value={formData.job_title} onChange={handleChange} className={inputBase} required />
                {errors.job_title && <span className="text-red-400 text-sm mt-1 block">{errors.job_title}</span>}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="current_job" className={labelBase}>Current Job *</label>
                <input id="current_job" type='text' name='current_job' value={formData.current_job} onChange={handleChange} className={inputBase} required />
                {errors.current_job && <span className="text-red-400 text-sm mt-1 block">{errors.current_job}</span>}
              </div>
              <div>
                <label htmlFor="current_employee" className={labelBase}>Current Employer *</label>
                <input id="current_employee" type='text' name='current_employee' value={formData.current_employee} onChange={handleChange} className={inputBase} required />
                {errors.current_employee && <span className="text-red-400 text-sm mt-1 block">{errors.current_employee}</span>}
              </div>
            </div>
            <div>
              <label htmlFor="job_experience" className={labelBase}>Job Experience *</label>
              <textarea id="job_experience" name='job_experience' value={formData.job_experience} onChange={handleChange} rows='4' className={inputBase} required />
              {errors.job_experience && <span className="text-red-400 text-sm mt-1 block">{errors.job_experience}</span>}
            </div>
          </fieldset>

          <fieldset className='space-y-4'>
            <legend className='text-lg sm:text-xl font-bold text-yellow-400 mb-3'>ACCOUNT SETUP</legend>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="username" className={labelBase}>Username *</label>
                <input id="username" type='text' name='username' value={formData.username} onChange={handleChange} className={inputBase} required />
                {errors.username && <span className="text-red-400 text-sm mt-1 block">{errors.username}</span>}
              </div>
              <div>
                <label htmlFor="signup-password" className={labelBase}>Password *</label>
                <div className="relative">
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} name='password' value={formData.password} onChange={handleChange} className={`${inputBase} pr-12`} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && <span className="text-red-400 text-sm mt-1 block">{errors.password}</span>}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label htmlFor="confirmPassword" className={labelBase}>Confirm Password *</label>
                <div className="relative">
                  <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className={`${inputBase} pr-12`} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-sm transition-colors" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                    {showConfirmPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-red-400 text-sm mt-1 block">{errors.confirmPassword}</span>}
              </div>
            </div>
          </fieldset>

          <fieldset className='space-y-4'>
            <legend className='text-lg sm:text-xl font-bold text-yellow-400 mb-3'>SIGNATURE</legend>
            <div>
              <SignaturePad onSignature={handleSignature} />
              {errors.signature_data && <span className="text-red-400 text-sm mt-1 block">{errors.signature_data}</span>}
            </div>
          </fieldset>

          <div className='flex flex-col sm:flex-row gap-4 pt-2'>
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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches ? e.touches[0] : e;
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    let drawing = false;

    const startDrawing = (e) => {
      e.preventDefault();
      drawing = true;
      const pos = getPos(e);
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!drawing) return;
      e.preventDefault();
      const pos = getPos(e);
      const ctx = canvas.getContext('2d');
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!drawing) return;
      drawing = false;
      setHasSignature(true);
      const dataUrl = canvas.toDataURL('image/png');
      onSignature(dataUrl);
    };

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    return () => {
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
    };
  }, [onSignature]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setHasSignature(false);
    onSignature('');
  };

  return (
    <div>
      <div className="relative bg-white border border-gray-600 rounded-xl w-full" style={{ height: '200px' }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>
      <div className="flex gap-3 mt-3">
        <button type="button" onClick={clearSignature} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors">Clear</button>
        {hasSignature && <span className="text-green-400 text-sm mt-1">Signature captured</span>}
      </div>
    </div>
  );
};

export default Signup;
