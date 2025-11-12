import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ImageGalleryViewerProps {
  images: string[];
  productName?: string;
  className?: string;
}

const ImageGalleryViewer = ({
  images,
  productName = 'Product',
  className,
}: ImageGalleryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className={clsx('rounded-2xl bg-grey-100 flex items-center justify-center', className)}>
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-grey-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-grey-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-grey-600">No images available</p>
          <p className="text-sm text-grey-400 mt-1">Product images will appear here</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleOpenLightbox = () => {
    setIsLightboxOpen(true);
  };

  return (
    <div className={className}>
      {/* Main Image Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-grey-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentImage}
              alt={`${productName} - Image ${currentIndex + 1}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={clsx(
                'w-full h-full object-cover transition-transform duration-300',
                isZoomed && 'scale-150 cursor-zoom-out',
                !isZoomed && 'cursor-zoom-in'
              )}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </AnimatePresence>

          {/* Zoom Hint */}
          {!isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg flex items-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4 text-white" />
                <span className="text-xs font-medium text-white">Click to zoom</span>
              </div>
            </motion.div>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={handleOpenLightbox}
            className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ArrowsPointingOutIcon className="w-5 h-5 text-grey-700" />
          </button>

          {/* Navigation Arrows (if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <ChevronLeftIcon className="w-5 h-5 text-grey-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              >
                <ChevronRightIcon className="w-5 h-5 text-grey-700" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/70 backdrop-blur-sm rounded-lg">
              <span className="text-sm font-medium text-white">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold scrollbar-track-grey-100">
            {images.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all',
                  index === currentIndex
                    ? 'border-gold ring-2 ring-gold/30 shadow-lg'
                    : 'border-grey-200 hover:border-gold/50 opacity-70 hover:opacity-100'
                )}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent pointer-events-none" />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              onClick={() => setIsLightboxOpen(false)}
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-white font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={currentImage}
                  alt={`${productName} - Image ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                    className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all hover:scale-110"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-2xl">
                <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThumbnailClick(index);
                      }}
                      className={clsx(
                        'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                        index === currentIndex
                          ? 'border-gold scale-110'
                          : 'border-white/20 opacity-50 hover:opacity-100 hover:scale-105'
                      )}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Keyboard Navigation Hint */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-white text-sm">Use ← → keys to navigate</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #b8941e;
        }
      `}</style>
    </div>
  );
};

export default ImageGalleryViewer;

