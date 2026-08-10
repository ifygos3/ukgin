import React from 'react';
import { motion } from 'framer-motion';

const MotionCard = ({ title, text, delay = 0, isMobile = false }) => {
  const offset = isMobile ? 15 : 30;
  const scale = isMobile ? 0.97 : 0.95;
  return (
    <motion.div
      initial={{ opacity: 0, y: offset, scale }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className='bg-gray-900/80 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-yellow-400/20 shadow-2xl shadow-black/20 hover:border-yellow-400/40 transition-colors'
    >
      <h3 className='text-3xl md:text-4xl font-extrabold text-yellow-400 mb-6'>{title}</h3>
      <p className='text-gray-200 text-lg leading-8'>{text}</p>
    </motion.div>
  );
};

export const MissionVision = ({ isMobile = false }) => {
  return (
    <div className='pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8'>
      <h2 className='text-5xl md:text-6xl font-extrabold text-yellow-400 text-center mb-16'>Our Mission & Vision</h2>
      <div className='grid md:grid-cols-2 gap-10'>
        <MotionCard title='Our Mission' text='To unite Ndi Igbo worldwide through cultural preservation, youth empowerment, economic development, and community building. We strive to create a global network that supports Igbo identity, promotes educational excellence, and drives positive change in every community we serve.' delay={0.1} isMobile={isMobile} />
        <MotionCard title='Our Vision' text='A united and empowered global Igbo community that preserves its rich heritage while driving innovation, economic prosperity, and social progress. We envision a world where every Igbo person feels connected, valued, and equipped to make a difference.' delay={0.3} isMobile={isMobile} />
      </div>
    </div>
  );
};

export default MissionVision;
