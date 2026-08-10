import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, CardSkeleton, EmptyState } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const resolveMediaUrl = (value) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) return trimmed;
  if (trimmed.startsWith('/')) return `${API_BASE_URL}${trimmed}`;
  return trimmed;
};

const GalleryMedia = ({ item, onOpen }) => {
  const [failed, setFailed] = useState(false);
  const rawUrl = item?.media_url || item?.image_url || item?.image || item?.url || item?.secure_url || item?.src;
  const mediaUrl = resolveMediaUrl(rawUrl);
  const mediaType = item?.media_type === 'video' || /\.(mp4|mov|webm|ogg|ogv|avi|mkv)$/i.test(mediaUrl) ? 'video' : 'image';
  const videoType = mediaType === 'video' ? (mediaUrl.endsWith('.webm') ? 'video/webm' : mediaUrl.endsWith('.ogg') || mediaUrl.endsWith('.ogv') ? 'video/ogg' : 'video/mp4') : null;

  if (!mediaUrl || failed) {
    return <div className="w-full h-72 bg-gray-800 flex items-center justify-center text-4xl">🖼️</div>;
  }

  if (mediaType === 'video') {
    return (
      <video
        src={mediaUrl}
        type={videoType}
        controls
        controlsList="nodownload"
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        className="w-full h-72 object-contain bg-black"
        onError={() => { console.error('Video failed to load:', mediaUrl, 'raw:', rawUrl); setFailed(true); }}
      />
    );
  }

  return (
    <button type="button" onClick={() => onOpen?.(item)} className="block w-full text-left cursor-zoom-in group">
      <img src={mediaUrl} alt={item?.title || 'Gallery image'} className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" onError={() => setFailed(true)} />
    </button>
  );
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);


  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/public/gallery-items/`);
        const data = res.data;
        setImages(Array.isArray(data) ? data : data.results || []);
        setError('');
      } catch (err) {
        console.error(err);
        setImages([]);
        setError('Unable to load gallery items right now.');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen pt-16 sm:pt-18 md:pt-20 px-4 sm:px-6 md:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-yellow-400 text-center mb-14">Gallery</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} lines={2} />
            ))}
          </div>
        ) : error ? (
          <EmptyState icon="⚠️" title="Unable to load gallery" description={error} />
        ) : images.length === 0 ? (
          <EmptyState icon="🖼️" title="No gallery images yet" description="Check back later for photos and videos from UKGIN events." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 shadow-lg hover:border-yellow-400/30 transition-all duration-300 hover:scale-[1.02] group">
                <GalleryMedia item={image} onOpen={setSelectedItem} />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">{image.title || 'Gallery Image'}</h2>
                  {image.description && <p className="text-gray-400 text-base leading-6">{image.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


{/* <video controls width="100%">
<src="https://res.cloudinary.com/dtxdhkaqs/video/upload/v1786124677/media/gallery_media/UKGIN_CARNIVAL_DEC_6TH._2025_wkcckm.mp4" type="video/mp4">
</video> */}



      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 py-6" onClick={() => setSelectedItem(null)} role="dialog" aria-modal="true" aria-label="Media preview">
          <div className="relative w-full max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setSelectedItem(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-2 text-white text-sm hover:bg-black/90 transition-colors" aria-label="Close preview">Close</button>
              {(() => {
                const rawUrl = selectedItem?.media_url || selectedItem?.image_url || selectedItem?.image || selectedItem?.url || selectedItem?.secure_url || selectedItem?.src;
                const mediaUrl = resolveMediaUrl(rawUrl);
                const mediaType = selectedItem?.media_type === 'video' || /\.(mp4|mov|webm|ogg|ogv|avi|mkv)$/i.test(mediaUrl) ? 'video' : 'image';
                const videoType = mediaType === 'video' ? (mediaUrl.endsWith('.webm') ? 'video/webm' : mediaUrl.endsWith('.ogg') || mediaUrl.endsWith('.ogv') ? 'video/ogg' : 'video/mp4') : null;
                if (mediaType === 'video') {
                  return <video src={mediaUrl} type={videoType} controls controlsList="nodownload" preload="auto" playsInline crossOrigin="anonymous" className="max-h-[85vh] w-full object-contain rounded-2xl" />;
                }
                return <img src={mediaUrl} alt={selectedItem.title || 'Gallery image'} className="max-h-[85vh] w-full object-contain rounded-2xl" />;
              })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
