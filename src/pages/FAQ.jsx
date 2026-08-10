import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { q: 'What is UKGIN?', a: 'UKGIN is the United Kingdom of Great Igbo Nation, a global organization dedicated to promoting Igbo unity, culture, and economic empowerment.' },
    { q: 'How do I become a member?', a: 'Visit our Sign Up page, fill out the registration form with your details, and submit. You will receive a confirmation email with your membership details.' },
    { q: 'What are the membership benefits?', a: 'Members receive access to community events, networking opportunities, mentorship programs, cultural activities, and the ability to participate in leadership roles.' },
    { q: 'How can I donate?', a: 'Visit our Donation page to make a contribution via bank transfer, cryptocurrency, or credit/debit card. You can donate anonymously or as a registered member.' },
    { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions in the reset email you receive.' },
    { q: 'Can I volunteer?', a: 'Yes! Visit our Volunteer page to register your interest. We welcome volunteers for events, community service, and organizational activities.' },
    { q: 'How do I contact UKGIN?', a: 'You can reach us via email at info@ukgin.org, call our office, or use the contact form on our Contact page.' },
    { q: 'Is my data secure?', a: 'Yes. We take data security seriously and use industry-standard encryption and security practices to protect your personal information.' },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-300 text-lg mb-10 text-center">Find answers to common questions about UKGIN membership, events, and services.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-400/30 transition">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4" aria-expanded={openIndex === i}>
                <span className="text-white font-bold text-base sm:text-lg">{faq.q}</span>
                <span className="text-yellow-400 text-xl font-bold shrink-0 transition-transform duration-200" style={{ transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-300 leading-7">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
