import React from 'react';

const Contact = () => {
  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>Contact Us</h1>
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800'>
          <h2 className='text-2xl font-bold text-yellow-400 mb-6'>Send us a message</h2>
          <form className='space-y-4'>
            <input type='text' placeholder='Your Name' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
            <input type='email' placeholder='Your Email' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
            <input type='text' placeholder='Subject' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
            <textarea placeholder='Your message' rows='5' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white' required />
            <button type='submit' className='w-full bg-yellow-500 text-black py-4 rounded-xl font-bold hover:bg-yellow-400 transition'>Send Message</button>
          </form>
        </div>
        <div className='space-y-6'>
          <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
            <h3 className='text-yellow-400 font-bold mb-2'>📍 Office Address</h3>
            <p className='text-gray-300 text-sm'>123 Igbo Way, Lagos, Nigeria</p>
            <p className='text-gray-300 text-sm'>45 Churchill Avenue, London, UK</p>
          </div>
          <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
            <h3 className='text-yellow-400 font-bold mb-2'>📞 Phone Numbers</h3>
            <p className='text-gray-300 text-sm'>+234 123 456 7890 (Nigeria)</p>
            <p className='text-gray-300 text-sm'>+44 20 1234 5678 (UK)</p>
            <p className='text-gray-300 text-sm'>+1 555 123 4567 (USA)</p>
          </div>
          <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
            <h3 className='text-yellow-400 font-bold mb-2'>✉️ Email</h3>
            <p className='text-gray-300 text-sm'>info@ukgin.org</p>
            <p className='text-gray-300 text-sm'>support@ukgin.org</p>
            <p className='text-gray-300 text-sm'>events@ukgin.org</p>
          </div>
          <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
            <h3 className='text-yellow-400 font-bold mb-2'>🕐 Business Hours</h3>
            <p className='text-gray-300 text-sm'>Mon-Fri: 9AM - 5PM WAT</p>
            <p className='text-gray-300 text-sm'>Sat: 10AM - 2PM WAT</p>
            <p className='text-gray-300 text-sm'>Sun: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;