import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { XMarkIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ReviewFormData>;
  isLoading?: boolean;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  images: string[];
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [comment, setComment] = useState(initialData?.comment || '');
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imageInput, setImageInput] = useState('');

  const handleAddImage = () => {
    if (imageInput.trim()) {
      if (images.length >= 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    onSubmit({ rating, title, comment, images });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-grey-100 flex items-center justify-between bg-gradient-to-r from-gold-pale to-gold-light/50">
          <h3 className="text-xl font-bold text-grey-900">
            {initialData ? 'Edit Review' : 'Write a Review'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-grey-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-grey-900 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <StarRating
                rating={rating}
                size="xl"
                interactive
                onChange={setRating}
              />
              {rating > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-gold-pale rounded-xl"
                >
                  <span className="text-lg font-bold text-gold-dark">{rating}.0</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-grey-900 mb-2">
              Review Title <span className="text-grey-500 font-normal">(Optional)</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience in a few words"
              className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
              maxLength={100}
            />
            <p className="mt-1 text-xs text-grey-500">{title.length}/100 characters</p>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-semibold text-grey-900 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product. What did you like or dislike?"
              rows={6}
              className="w-full px-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all resize-none"
              maxLength={1000}
            />
            <p className="mt-1 text-xs text-grey-500">{comment.length}/1000 characters</p>
          </div>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-grey-900 mb-2">
              Photos <span className="text-grey-500 font-normal">(Optional - up to 5)</span>
            </label>
            
            {/* Image input */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-4 py-3 border border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={!imageInput.trim() || images.length >= 5}
                className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PhotoIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-grey-100"
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    >
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-grey-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-6 py-3 border-2 border-grey-200 text-grey-700 rounded-xl font-semibold hover:bg-grey-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={isLoading || rating === 0 || !comment.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={clsx(
                'px-8 py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                'bg-gradient-to-r from-gold to-gold-dark text-white hover:shadow-xl'
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <span>{initialData ? 'Update Review' : 'Submit Review'}</span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

















