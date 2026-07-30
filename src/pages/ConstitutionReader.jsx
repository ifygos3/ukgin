import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ConstitutionReader = () => {
  const constitutionText = `
    PREAMBLE

    We, the members of the United Kingdom of Great Igbo Nation (UKGIN), united in our shared heritage, culture, and commitment to the Igbo people worldwide, do hereby establish and ordain this Constitution for the governance of our organization.

    CHAPTER I - NAME AND REGISTRATION

    1.1 The name of the organization shall be the United Kingdom of Great Igbo Nation, hereinafter referred to as "UKGIN".
    1.2 UKGIN is a non-profit, non-sectarian, and non-political organization incorporated to promote the cultural, social, and economic welfare of the Igbo people in the United Kingdom and beyond.
    1.3 The registered office shall be in the United Kingdom, at such address as may be determined by the National Executive Council.

    CHAPTER II - OBJECTIVES

    2.1 The objectives of UKGIN are:
    (a) To promote and preserve Igbo culture, traditions, and language in the United Kingdom and worldwide.
    (b) To foster unity, friendship, and mutual understanding among Igbo people and other communities.
    (c) To provide educational, social, and economic support to members and the wider community.
    (d) To promote youth development, leadership, and empowerment programs.
    (e) To support charitable causes and community development initiatives.
    (f) To advocate for the interests and welfare of the Igbo community in the United Kingdom.
    (g) To maintain a non-partisan stance on political matters affecting the Igbo people.

    CHAPTER III - MEMBERSHIP

    3.1 Membership of UKGIN shall be open to all persons of Igbo descent or those committed to Igbo cultural promotion, irrespective of tribe, religion, or political affiliation.
    3.2 Members shall be required to register and pay the prescribed membership fees.
    3.3 Membership may be terminated for conduct detrimental to the goals and reputation of UKGIN.

    CHAPTER IV - GOVERNANCE

    4.1 The governing body of UKGIN shall be the National Executive Council (NEC).
    4.2 The NEC shall consist of the President, Vice President, Secretary, Treasurer, and other elected officers.
    4.3 State Chapters shall be established under the supervision of the NEC to coordinate activities at state and regional levels.

    CHAPTER V - STATE CHAPTERS AND BRANCHES

    5.1 State Chapters may be established by the NEC upon the recommendation of members in that state.
    5.2 Each State Chapter shall have a Coordinator and shall report activities to the NEC quarterly.
    5.3 Local Government Area (LGA) Branches may be established under each State Chapter for grassroots operations.

    CHAPTER VI - FINANCE

    6.1 UKGIN shall be financed through membership fees, donations, grants, and other lawful sources of income.
    6.2 All funds shall be managed by the Treasurer under the oversight of the NEC and subject to annual audit.
    6.3 The financial year of UKGIN shall run from 1st January to 31st December.

    CHAPTER VII - MEETINGS

    7.1 The Annual General Meeting (AGM) shall be held once every calendar year.
    7.2 Extraordinary General Meetings may be called by the President or upon the written request of not less than one-third of the members.
    7.3 Notice of meetings shall be given at least fourteen (14) days before the date of the meeting.

    CHAPTER VIII - DISCIPLINE AND DISPUTE RESOLUTION

    8.1 Any member accused of misconduct shall be given an opportunity to be heard by the NEC.
    8.2 The NEC shall have the power to suspend or expel members found guilty of misconduct.

    CHAPTER IX - AMENDMENTS

    9.1 This Constitution may be amended by a two-thirds majority vote of members present at a General Meeting.
    9.2 Proposed amendments must be submitted in writing to the Secretary at least fourteen (14) days before the meeting.

    CHAPTER X - DISSOLUTION

    10.1 UKGIN may be dissolved by a three-quarters majority vote at a General Meeting specifically convened for that purpose.
    10.2 Upon dissolution, the assets of UKGIN shall be distributed to charitable causes aligned with its objectives.

    SCHEDULE - SIGNATORIES

    This Constitution was adopted on the date of ratification by the founding members of UKGIN.
  `;

  const lines = constitutionText.split('\n');
  const [query, setQuery] = useState('');
  const [activeLine, setActiveLine] = useState(null);

  const filteredLines = query
    ? lines.filter((line, idx) => {
        const terms = query.toLowerCase().split(' ').filter(Boolean);
        const haystack = line.toLowerCase();
        return terms.every(t => haystack.includes(t));
      })
    : lines;

  return (
    <div className='pt-32 px-6 md:px-20'>
      <div className='max-w-5xl mx-auto'>
        <div className='flex flex-wrap gap-4 items-center justify-between mb-6'>
          <div>
            <h1 className='text-4xl font-bold text-yellow-400'>Constitution of UKGIN</h1>
            <p className='text-gray-400 mt-1'>Read the full constitution online with search and navigation.</p>
          </div>
          <div className='flex gap-3'>
            <Link to='/constitution' className='bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition'>Back</Link>
            <button onClick={() => { const blob = new Blob([constitutionText], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'UKGIN-Constitution.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }} className='bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition'>Download</button>
          </div>
        </div>

        <div className='mb-6'>
          <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search constitution...' className='w-full bg-black p-4 rounded-xl border border-gray-700 text-white focus:border-yellow-400 focus:outline-none' />
          <p className='text-gray-500 text-xs mt-2'>{query ? `${filteredLines.length} match${filteredLines.length === 1 ? '' : 'es'} found` : 'Showing full constitution'}</p>
        </div>

        <div className='bg-gray-900 p-6 md:p-10 rounded-2xl border border-gray-800'>
          {filteredLines.map((line, idx) => {
            const originalIndex = lines.indexOf(line);
            const isHeading = /^(CHAPTER|PRE|SCHEDULE|\d+\.\d)/.test(line.trim());
            const isActive = activeLine === originalIndex;
            return (
              <div
                key={originalIndex}
                onMouseEnter={() => setActiveLine(originalIndex)}
                onMouseLeave={() => setActiveLine(null)}
                className={`py-2 px-3 rounded-lg transition cursor-text ${isHeading ? 'text-yellow-400 font-bold' : 'text-gray-300'} ${isActive ? 'bg-gray-800' : ''}`}
              >
                {line || '\u00A0'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConstitutionReader;
