import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  const leadership = [
    { name: 'Dr. Chukwuemeka Eze', position: 'National President', bio: 'Visionary leader with 20+ years of community service.' },
    { name: 'Ngozi Okonkwo', position: 'National Vice President', bio: 'Champion of women empowerment and youth development.' },
    { name: 'Emeka Obi', position: 'National Secretary', bio: 'Dedicated administrator and community organizer.' },
    { name: 'Adaeze Nwosu', position: 'National Treasurer', bio: 'Financial expert committed to transparency and growth.' },
  ];

  const branches = [
    { state: 'Lagos', coordinator: 'Chidi Okafor', members: '150+' },
    { state: 'Anambra', coordinator: 'Ngozi Eze', members: '120+' },
    { state: 'Rivers', coordinator: 'Emeka Nwosu', members: '80+' },
    { state: 'FCT', coordinator: 'Adaeze Okonkwo', members: '90+' },
  ];

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 mb-6'>About UKGIN</h1>

      {/* Our Story */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-4'>Our Story</h2>
        <p className='text-gray-300 leading-8 text-lg'>
          United Kingdom of Great Igbo Nation (UKGIN) was founded with a vision to unite Ndi Igbo across the globe. What started as a small community initiative has grown into a worldwide organization with members in multiple countries, state chapters, and LGA-level branches. Our journey has been driven by a shared commitment to preserving Igbo culture, empowering youth, and building economic opportunities for our community.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className='grid md:grid-cols-2 gap-8 mb-16'>
        <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800'>
          <h2 className='text-3xl font-bold text-yellow-400 mb-4'>Our Mission</h2>
          <p className='text-gray-300 leading-8'>To unite Ndi Igbo worldwide through cultural preservation, youth empowerment, economic development, and community building. We strive to create a global network that supports Igbo identity, promotes educational excellence, and drives positive change in every community we serve.</p>
        </div>
        <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800'>
          <h2 className='text-3xl font-bold text-yellow-400 mb-4'>Our Vision</h2>
          <p className='text-gray-300 leading-8'>A united and empowered global Igbo community that preserves its rich heritage while driving innovation, economic prosperity, and social progress. We envision a world where every Igbo person feels connected, valued, and equipped to make a difference.</p>
        </div>
      </section>

      {/* Objectives */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Our Objectives</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          {[
            'Promote Igbo culture and heritage globally',
            'Empower youths through education and leadership programs',
            'Foster economic development and entrepreneurship',
            'Build strong community bonds across diaspora',
            'Support charitable causes and social initiatives',
            'Advocate for Igbo interests and representation',
          ].map((obj, i) => (
            <div key={i} className='flex items-start gap-3 bg-gray-900 p-4 rounded-xl'>
              <span className='text-yellow-400 mt-1'>✓</span>
              <span className='text-gray-300'>{obj}</span>
            </div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Our History</h2>
        <div className='space-y-6'>
          {[
            { year: '2020', event: 'UKGIN founded with a vision to unite Ndi Igbo globally' },
            { year: '2021', event: 'First state chapter launched in Lagos' },
            { year: '2022', event: 'Expanded to 10 state chapters with 500+ members' },
            { year: '2023', event: 'Launched youth empowerment and scholarship programs' },
            { year: '2024', event: 'Reached 1,000+ members across 20+ states' },
            { year: '2025', event: 'Launched digital membership and online events platform' },
          ].map((h, i) => (
            <div key={i} className='flex gap-4 items-start'>
              <div className='bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap'>{h.year}</div>
              <div className='bg-gray-900 p-4 rounded-xl border border-gray-800 flex-1'>
                <p className='text-gray-300'>{h.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Executive Leadership</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {leadership.map((l, i) => (
            <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center hover:border-yellow-400/30 transition'>
              <div className='w-20 h-20 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl'>👤</div>
              <h3 className='text-white font-bold text-lg'>{l.name}</h3>
              <p className='text-yellow-400 text-sm mb-2'>{l.position}</p>
              <p className='text-gray-400 text-sm'>{l.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Organizational Structure */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Organizational Structure</h2>
        <div className='bg-gray-900 p-6 rounded-2xl border border-gray-800'>
          <p className='text-gray-300 mb-4'>UKGIN operates through a hierarchical structure with national executives overseeing state chapters and LGA branches:</p>
          <ul className='space-y-2 text-gray-300'>
            <li className='flex items-center gap-2'><span className='text-yellow-400'>•</span> National Executive Council</li>
            <li className='ml-6 flex items-center gap-2'><span className='text-yellow-400'>•</span> State Coordinators</li>
            <li className='ml-12 flex items-center gap-2'><span className='text-yellow-400'>•</span> LGA Chapter Presidents</li>
            <li className='ml-18 flex items-center gap-2'><span className='text-yellow-400'>•</span> Community Representatives</li>
          </ul>
        </div>
      </section>

      {/* State Chapters */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>State Chapters</h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-800'>
                <th className='text-left p-3 text-gray-400'>State</th>
                <th className='text-left p-3 text-gray-400'>Coordinator</th>
                <th className='text-left p-3 text-gray-400'>Members</th>
                <th className='text-left p-3 text-gray-400'>Action</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b, i) => (
                <tr key={i} className='border-b border-gray-800/50 hover:bg-gray-800/30'>
                  <td className='p-3 text-white font-bold'>{b.state}</td>
                  <td className='p-3 text-gray-300'>{b.coordinator}</td>
                  <td className='p-3 text-gray-400'>{b.members}</td>
                  <td className='p-3'><Link to='/state-chapters' className='text-yellow-400 hover:text-yellow-300 text-sm'>View Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Achievements */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Achievements</h2>
        <div className='grid md:grid-cols-3 gap-6'>
          {[
            { number: '1500+', label: 'Members Worldwide' },
            { number: '36', label: 'State Chapters' },
            { number: '700+', label: 'LGA Branches' },
            { number: '₦50M+', label: 'Total Donations' },
            { number: '120+', label: 'Events Hosted' },
            { number: '50+', label: 'Empowerment Programs' },
          ].map((a, i) => (
            <div key={i} className='bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center'>
              <div className='text-3xl font-bold text-yellow-400'>{a.number}</div>
              <div className='text-gray-400 mt-2'>{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Join */}
      <section className='mb-16'>
        <h2 className='text-3xl font-bold text-yellow-400 mb-6'>Why Join UKGIN</h2>
        <div className='grid md:grid-cols-2 gap-6'>
          {[
            'Connect with Ndi Igbo worldwide',
            'Access mentorship and leadership programs',
            'Participate in cultural events and festivals',
            'Contribute to community development projects',
            'Earn professional recognition and certificates',
            'Access exclusive networking opportunities',
          ].map((reason, i) => (
            <div key={i} className='flex items-start gap-3 bg-gray-900 p-4 rounded-xl'>
              <span className='text-yellow-400 mt-1'>★</span>
              <span className='text-gray-300'>{reason}</span>
            </div>
          ))}
        </div>
      </section>

      <div className='text-center mb-10'>
        <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-10 py-4 rounded-full font-bold transition text-lg'>Join UKGIN</Link>
      </div>
    </div>
  );
};

export default About;