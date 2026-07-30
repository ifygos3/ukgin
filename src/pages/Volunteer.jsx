import React from 'react';

const Volunteer = () => {
  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Volunteer With UKGIN</h1>
      <p className='text-gray-300 text-lg mb-8'>Make a difference by volunteering your time and skills for the community.</p>
      <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-2xl'>
        <form className='space-y-5'>
          <input type='text' placeholder='Full Name' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
          <input type='email' placeholder='Email Address' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
          <input type='text' placeholder='Phone Number' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
          <div>
            <label className='block text-sm text-gray-400 mb-1'>Skills</label>
            <input type='text' placeholder='e.g., Event Planning, Writing, Design' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
          </div>
          <div>
            <label className='block text-sm text-gray-400 mb-1'>Availability</label>
            <select className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white'>
              <option value=''>Select availability</option>
              <option value='weekdays'>Weekdays</option>
              <option value='weekends'>Weekends</option>
              <option value='flexible'>Flexible</option>
            </select>
          </div>
          <div>
            <label className='block text-sm text-gray-400 mb-1'>Areas of Interest</label>
            <div className='flex flex-wrap gap-2'>
              {['Events', 'Community Service', 'Education', 'Fundraising', 'Marketing', 'IT', 'Design', 'Writing'].map((area) => (
                <label key={area} className='bg-gray-800 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-gray-700'>
                  <input type='checkbox' className='mr-2' /> {area}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm text-gray-400 mb-1'>Resume (optional)</label>
            <input type='file' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' />
          </div>
          <button type='submit' className='w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition'>Submit Volunteer Application</button>
        </form>
      </div>
    </div>
  );
};

export default Volunteer;