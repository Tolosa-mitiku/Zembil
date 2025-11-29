import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  StarIcon,
  ArrowsPointingOutIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import toast from 'react-hot-toast';

export interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isPrimary?: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
}

interface ImageGalleryEditorProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  className?: string;
}

const ImageGalleryEditor = ({
  images,
  onImagesChange,
  onUpload,
  maxImages = 10,
  maxSizePerImage = 5,
  className,
}: ImageGalleryEditorProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check if we exceed max images
      if (images.length + acceptedFiles.length > maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      // Validate file sizes
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSizePerImage * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed ${maxSizePerImage}MB limit`);
        return;
      }

      // Create preview URLs for immediate feedback
      const newImages: ImageItem[] = acceptedFiles.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        file,
        isUploading: true,
        uploadProgress: 0,
        isPrimary: images.length === 0 && index === 0, // First image becomes primary
      }));

      // Add images with uploading state
      const updatedImages = [...images, ...newImages];
      onImagesChange(updatedImages);

      // Upload images if handler provided
      if (onUpload) {
        setUploading(true);
        try {
          const uploadedUrls = await onUpload(acceptedFiles);

          // Update images with uploaded URLs
          const finalImages = updatedImages.map((img) => {
            if (img.isUploading) {
              const index = newImages.findIndex((ni) => ni.id === img.id);
              if (index !== -1 && uploadedUrls[index]) {
                return {
                  ...img,
                  url: uploadedUrls[index],
                  isUploading: false,
                  uploadProgress: 100,
                };
              }
            }
            return img;
          });

          onImagesChange(finalImages);
          toast.success(`${acceptedFiles.length} image(s) uploaded successfully!`);
        } catch (error) {
          toast.error('Failed to upload some images');
          // Remove failed uploads
          onImagesChange(images);
        } finally {
          setUploading(false);
        }
      }
    },
    [images, maxImages, maxSizePerImage, onImagesChange, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: maxImages - images.length,
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const handleRemove = (id: string) => {
    const filtered = images.filter((img) => img.id !== id);
    // If removed image was primary, make first image primary
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onImagesChange(filtered);
    toast.success('Image removed');
  };

  const handleSetPrimary = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onImagesChange(updated);
    toast.success('Primary image updated');
  };

  const handleReorder = (newOrder: ImageItem[]) => {
    onImagesChange(newOrder);
  };

  const handlePreview = (url: string) => {
    setPreviewImage(url);
  };

  return (
    <div className={className}>
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div
          {...getRootProps()}
          className={clsx(
            'relative border-2 border-dashed rounded-2xl transition-all cursor-pointer group overflow-hidden',
            'min-h-[280px] flex items-center justify-center',
            isDragActive
              ? 'border-gold bg-gradient-to-br from-gold-pale to-gold/10 scale-[1.02]'
              : 'border-grey-300 hover:border-gold hover:bg-grey-50',
            uploading && 'opacity-50 cursor-not-allowed',
            images.length >= maxImages && 'opacity-40 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />

          <div className="text-center px-6">
            <AnimatePresence mode="wait">
              {uploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gold/20 border-t-gold"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PhotoIcon className="w-8 h-8 text-gold" />
                    </div>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-grey-700">
                    Uploading images...
                  </p>
                  <p className="text-sm text-grey-500 mt-1">Please wait</p>
                </motion.div>
              ) : isDragActive ? (
                <motion.div
                  key="drag-active"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <CloudArrowUpIcon className="w-20 h-20 text-gold mb-4 animate-bounce" />
                  <p className="text-xl font-bold text-gold">Drop your images here!</p>
                  <p className="text-sm text-grey-600 mt-2">Release to upload</p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <PhotoIcon className="w-10 h-10 text-gold" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                      <CloudArrowUpIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-grey-900 mb-2">
                    {images.length >= maxImages ? (
                      'Maximum images reached'
                    ) : (
                      'Upload Product Images'
                    )}
                  </h3>

                  {images.length < maxImages && (
                    <>
                      <p className="text-base text-grey-600 mb-1">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-sm text-grey-500">
                        JPG, PNG, WEBP • Max {maxSizePerImage}MB per image
                      </p>
                      <p className="text-sm text-grey-400 mt-3">
                        {images.length} / {maxImages} images uploaded
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-gold/10 text-xs font-medium text-gold">
                          Auto Compress
                        </span>
                        <span className="px-3 py-1 rounded-full bg-green-50 text-xs font-medium text-green-600">
                          Multiple Upload
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-transparent to-gold/0 group-hover:from-gold/5 group-hover:to-gold/10 transition-all duration-500 pointer-events-none" />
        </div>
      </motion.div>

      {/* Image Grid with Drag to Reorder */}
      {images.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-grey-700 flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-gold" />
              Product Images ({images.length})
            </h4>
            <p className="text-xs text-grey-500">
              Drag to reorder • Star to set primary
            </p>
          </div>

          <Reorder.Group
            axis="y"
            values={images}
            onReorder={handleReorder}
            className="space-y-3"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <Reorder.Item key={image.id} value={image}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={clsx(
                      'relative group rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg',
                      image.isPrimary
                        ? 'border-gold bg-gold/5'
                        : 'border-grey-200 hover:border-gold/50'
                    )}
                  >
                    <div className="flex items-center gap-4 p-3">
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
                        <div className="flex flex-col gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-grey-400"></div>
                          <div className="w-1 h-1 rounded-full bg-grey-400"></div>
                          <div className="w-1 h-1 rounded-full bg-grey-400"></div>
                        </div>
                      </div>

                      {/* Image Preview */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {image.isUploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <div className="text-white text-xs font-bold">
                              {image.uploadProgress || 0}%
                            </div>
                          </div>
                        )}
                        {/* Magnify button */}
                        <button
                          onClick={() => handlePreview(image.url)}
                          className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center"
                        >
                          <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Image Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-grey-900 truncate">
                          {image.file?.name || `Image ${index + 1}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {image.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-gold text-white text-xs font-semibold flex items-center gap-1">
                              <StarIconSolid className="w-3 h-3" />
                              Primary
                            </span>
                          )}
                          {image.file && (
                            <span className="text-xs text-grey-500">
                              {(image.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!image.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(image.id)}
                            className="p-2 rounded-lg hover:bg-gold/10 transition-colors"
                            title="Set as primary image"
                          >
                            <StarIcon className="w-5 h-5 text-gold" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(image.id)}
                          disabled={image.isUploading}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Remove image"
                        >
                          <XMarkIcon className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Primary indicator glow */}
                    {image.isPrimary && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10 pointer-events-none" />
                    )}
                  </motion.div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        </motion.div>
      )}

      {/* Lightbox Preview */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </motion.button>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGalleryEditor;

