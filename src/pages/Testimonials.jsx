import React from 'react';

const Testimonials = () => {
  const testimonials = [
    { name: "Chinedu Okafor", role: "Member since 2020", text: "UKGIN has given me a sense of belonging and purpose. The community is truly inspiring and welcoming.", avatar: "👨" },
    { name: "Adaeze Nwosu", role: "State Coordinator", text: "Leading our state chapter has been a rewarding experience. UKGIN makes real impact in people's lives.", avatar: "👩" },
    { name: "Emeka Obi", role: "Member since 2022", text: "Through UKGIN, I found mentorship, friendship, and opportunities to grow both personally and professionally.", avatar: "👨" },
    { name: "Ngozi Eze", role: "Volunteer", text: "Volunteering with UKGIN has been life-changing. The sense of community and purpose is unmatched.", avatar: "👩" },
    { name: "Chidi Okafor", role: "Partner", text: "UKGIN's commitment to Igbo culture and youth empowerment aligns perfectly with our mission.", avatar: "👨" },
    { name: "Adaeze Okonkwo", role: "Member since 2023", text: "The events and programs organized by UKGIN have helped me connect with my roots and build lasting relationships.", avatar: "👩" },
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 mb-6 text-center">Testimonials</h1>
        <p className="text-gray-300 text-lg mb-10 text-center max-w-2xl mx-auto">What our members and partners say about UKGIN.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-900/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-800 hover:border-yellow-400/30 transition text-center group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{t.avatar}</div>
              <p className="text-gray-300 italic leading-7 mb-4">"{t.text}"</p>
              <div>
                <p className="text-yellow-400 font-bold">{t.name}</p>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
