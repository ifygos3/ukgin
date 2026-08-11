import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Skeleton } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const About = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/pages/about/`);
        setPageContent(res.data);
      } catch {
        setPageContent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-extrabold text-yellow-400 mb-8'>About UKGIN</h1>
          <div className='grid md:grid-cols-2 gap-8'>
            {[1, 2].map(i => (
              <div key={i} className='bg-gray-900 p-8 rounded-2xl border border-gray-800 space-y-4'>
                <Skeleton className='w-16 h-16 mx-auto' />
                <Skeleton variant='text' className='w-1/2 mx-auto' />
                <Skeleton variant='text' className='w-full' />
                <Skeleton className='w-32 h-12 mx-auto' />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const content = pageContent?.content || '';

  const defaultLeadership = [
    { name: 'Queen Pat Ukachi Levison Ekeogu', position: 'President General/Founder', bio: 'Visionary leader with 20+ years of community service and advocacy for Igbo unity worldwide.' },
    { name: 'Ofochi Benjamin Atagana (Esq.)', position: 'National President', bio: 'Legal expert and community advocate with extensive experience in Igbo diaspora affairs.' },
    { name: 'Asiegbu Uloma', position: 'Vice National President', bio: 'Dedicated leader focused on youth empowerment and community development initiatives.' },
    { name: 'Mozo Nonso', position: 'Board Chairman', bio: 'Seasoned administrator and financial expert with a strong commitment to organizational governance and growth.' },
  ];

  const defaultBranches = [
    { state: 'Lagos', coordinator: 'Chidi Okafor', members: '150+' },
    { state: 'Anambra', coordinator: 'Ngozi Eze', members: '120+' },
    { state: 'Rivers', coordinator: 'Emeka Nwosu', members: '80+' },
    { state: 'FCT', coordinator: 'Adaeze Okonkwo', members: '90+' },
  ];

  return (
    <div className='min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-5xl md:text-7xl font-extrabold text-yellow-400 mb-8'>{pageContent?.title || 'About UKGIN'}</h1>

        {content && (
          <section className='mb-20'>
            <div className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-yellow-400/20'>
              <div className='prose prose-invert prose-gray max-w-none text-gray-200 leading-8 text-lg' dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
            </div>
          </section>
        )}

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6'>Our Story</h2>
          <p className='text-gray-200 leading-8 text-lg md:text-xl max-w-4xl'>
            United Kingdom of Great Igbo Nation (UKGIN) was founded with a vision to unite Ndi Igbo across the globe. What started as a small community initiative has grown into a worldwide organization with members in multiple countries, state chapters, and LGA-level branches. Our journey has been driven by a shared commitment to preserving Igbo culture, empowering youth, and building economic opportunities for our community.
          </p>
        </section>

        <section className='grid md:grid-cols-2 gap-8 mb-20'>
          <div className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-yellow-400/20 transition-all duration-300 hover:scale-[1.01]'>
            <h2 className='text-4xl font-extrabold text-yellow-400 mb-6'>Our Mission</h2>
            <p className='text-gray-200 leading-8 text-lg'>To unite Ndi Igbo worldwide through cultural preservation, youth empowerment, economic development, and community building. We strive to create a global network that supports Igbo identity, promotes educational excellence, and drives positive change in every community we serve.</p>
          </div>
          <div className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-yellow-400/20 transition-all duration-300 hover:scale-[1.01]'>
            <h2 className='text-4xl font-extrabold text-yellow-400 mb-6'>Our Vision</h2>
            <p className='text-gray-200 leading-8 text-lg'>A united and empowered global Igbo community that preserves its rich heritage while driving innovation, economic prosperity, and social progress. We envision a world where every Igbo person feels connected, valued, and equipped to make a difference.</p>
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Our Objectives</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
            {[
              'Promote Igbo culture and heritage globally',
              'Empower youths through education and leadership programs',
              'Foster economic development and entrepreneurship',
              'Build strong community bonds across diaspora',
              'Support charitable causes and social initiatives',
              'Advocate for Igbo interests and representation',
            ].map((obj, i) => (
              <div key={i} className='flex items-start gap-4 bg-gray-900/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-800 transition-all duration-300 hover:scale-[1.02]'>
                <span className='text-yellow-400 text-2xl mt-0.5'>✓</span>
                <span className='text-gray-200 text-lg leading-7'>{obj}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Our History</h2>
          <div className='space-y-6'>
            {[
              { year: '2020', event: 'UKGIN founded with a vision to unite Ndi Igbo globally' },
              { year: '2021', event: 'First state chapter launched in Lagos' },
              { year: '2022', event: 'Expanded to 10 state chapters with 500+ members' },
              { year: '2023', event: 'Launched youth empowerment and scholarship programs' },
              { year: '2024', event: 'Reached 1,000+ members across 20+ states' },
              { year: '2025', event: 'Launched digital membership and online events platform' },
            ].map((h, i) => (
              <div key={i} className='flex flex-col sm:flex-row gap-4 items-start'>
                <div className='bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold text-base whitespace-nowrap'>{h.year}</div>
                 <div className='bg-gray-900/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-800 flex-1 transition-all duration-300 hover:scale-[1.01]'>
                  <p className='text-gray-200 text-lg leading-7'>{h.event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Executive Leadership</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-7'>
            {defaultLeadership.map((l, i) => (
              <div key={i} className='bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800 text-center hover:border-yellow-400/40 transition-all duration-300 hover:scale-[1.02]'>
                <div className='w-24 h-24 bg-gray-700 rounded-full mx-auto mb-5 flex items-center justify-center text-4xl'>👤</div>
                <h3 className='text-white font-bold text-xl'>{l.name}</h3>
                <p className='text-yellow-400 text-base mb-3'>{l.position}</p>
                <p className='text-gray-400 text-base leading-6'>{l.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Organizational Structure</h2>
          <div className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-gray-800'>
            <p className='text-gray-200 text-lg mb-6 leading-8'>UKGIN operates through a hierarchical structure with national executives overseeing state chapters and LGA branches:</p>
            <ul className='space-y-4 text-gray-200 text-lg'>
              <li className='flex items-center gap-3'><span className='text-yellow-400 text-xl'>•</span> National Executive Council</li>
              <li className='flex items-center gap-3 ml-4 sm:ml-8'><span className='text-yellow-400 text-xl'>•</span> State Coordinators</li>
              <li className='flex items-center gap-3 ml-8 sm:ml-16'><span className='text-yellow-400 text-xl'>•</span> LGA Chapter Presidents</li>
              <li className='flex items-center gap-3 ml-12 sm:ml-24'><span className='text-yellow-400 text-xl'>•</span> Community Representatives</li>
            </ul>
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>State Chapters</h2>
          <div className='overflow-x-auto -mx-6 px-6'>
            <div className='inline-block min-w-full align-middle'>
              <table className='w-full text-base min-w-[600px]'>
                <thead>
                  <tr className='border-b-2 border-gray-800'>
                    <th className='text-left p-4 text-gray-400 text-lg'>State</th>
                    <th className='text-left p-4 text-gray-400 text-lg'>Coordinator</th>
                    <th className='text-left p-4 text-gray-400 text-lg'>Members</th>
                    <th className='text-left p-4 text-gray-400 text-lg'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {defaultBranches.map((b, i) => (
                    <tr key={i} className='border-b border-gray-800/50 hover:bg-gray-800/30'>
                      <td className='p-4 text-white font-bold text-lg'>{b.state}</td>
                      <td className='p-4 text-gray-300 text-lg'>{b.coordinator}</td>
                      <td className='p-4 text-gray-400 text-lg'>{b.members}</td>
                      <td className='p-4'><Link to='/state-chapters' className='text-yellow-400 hover:text-yellow-300 text-base font-bold'>View Details</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Achievements</h2>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-7'>
            {[
              { number: '1500+', label: 'Members Worldwide' },
              { number: '36', label: 'State Chapters' },
              { number: '700+', label: 'LGA Branches' },
              { number: '₦50M+', label: 'Total Donations' },
              { number: '120+', label: 'Events Hosted' },
              { number: '50+', label: 'Empowerment Programs' },
            ].map((a, i) => (
              <div key={i} className='bg-gray-900/80 backdrop-blur-sm p-7 rounded-3xl border border-gray-800 text-center'>
                <div className='text-4xl font-extrabold text-yellow-400'>{a.number}</div>
                <div className='text-gray-400 mt-3 text-lg'>{a.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-20'>
          <h2 className='text-4xl md:text-5xl font-extrabold text-yellow-400 mb-8'>Why Join UKGIN</h2>
          <div className='grid sm:grid-cols-2 gap-6'>
            {[
              'Connect with Ndi Igbo worldwide',
              'Access mentorship and leadership programs',
              'Participate in cultural events and festivals',
              'Contribute to community development projects',
              'Earn professional recognition and certificates',
              'Access exclusive networking opportunities',
            ].map((reason, i) => (
              <div key={i} className='flex items-start gap-4 bg-gray-900/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-800'>
                <span className='text-yellow-400 text-2xl mt-0.5'>★</span>
                <span className='text-gray-200 text-lg leading-7'>{reason}</span>
              </div>
            ))}
          </div>
        </section>

        <div className='text-center mb-10'>
          <Link to='/signup' className='bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-5 rounded-full font-bold transition text-xl'>Join UKGIN</Link>
        </div>
      </div>
    </div>
  );
};

export default About;
