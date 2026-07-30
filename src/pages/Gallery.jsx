import React from 'react';


const Gallery = () => {
  const images = [
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1974&auto=format&fit=crop',
  ];

  return (
    <div className='pt-32 px-6 md:px-20'>
      <h1 className='text-5xl font-bold text-yellow-400 text-center mb-14'>Gallery</h1>

      <div className='grid md:grid-cols-3 gap-6'>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className='rounded-3xl h-80 w-full object-cover hover:scale-105 transition duration-500'
          />
        ))}
      </div>
    </div>
  );
}

export default Gallery;