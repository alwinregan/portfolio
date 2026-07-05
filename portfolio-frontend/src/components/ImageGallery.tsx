'use client';

import { useState } from 'react';
;
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  className?: string;
}

export function ImageGallery({ images, title = 'Gallery', className = '' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const currentImage = images[selectedIndex];
  const hasMultiple = images.length > 1;

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getImageUrl = (img: string) => {
    if (img.startsWith('/')) {
      return `${import.meta.env.VITE_API_URL}${img}`;
    }
    return img;
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>

      {/* Main Image */}
      <div className="relative w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden group">
        <div className="relative aspect-video">
          <img
            src={getImageUrl(currentImage)}
            alt={`Gallery ${selectedIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
        </div>

        {/* Navigation Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Grid */}
      {hasMultiple && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedIndex
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary'
              }`}
            >
              <img
                src={getImageUrl(img)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={getImageUrl(currentImage)}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
            />

            {/* Lightbox Navigation */}
            {hasMultiple && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>

            {/* Counter */}
            {hasMultiple && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm font-semibold">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
