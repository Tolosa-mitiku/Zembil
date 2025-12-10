/**
 * ReviewForm Component
 * Modern, animated review submission form with image upload
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { useAddProductReviewMutation } from '../../../reviews/api/reviewsApi';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  orderId?: string;
}

const ReviewForm = ({ productId, productName, onSuccess, onCancel, orderId }: ReviewFormProps) => {
  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // API mutation
  const [addReview, { isLoading, error }] = useAddProductReviewMutation();

  // Rating labels
  const ratingLabels = [
    'Poor',
    'Fair', 
    'Good',
    'Very Good',
    'Excellent'
  ];

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file sizes (max 5MB each)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidTypes = files.filter(file => !validTypes.includes(file.type));
    if (invalidTypes.length > 0) {
      toast.error('Only JPG, PNG, and WebP images are allowed');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview URLs
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImageUrls]);
      setImageFiles(prev => [...prev, ...files]);
      
      toast.success(`${files.length} image(s) added`);
    } catch (err) {
      toast.error('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    try {
      // In a real implementation, you would upload images to your storage service
      // and get back URLs. For now, we'll use the preview URLs
      // TODO: Implement actual image upload to your backend/storage
      const imageUrls = images; // Replace with actual uploaded URLs

      await addReview({
        productId,
        review: {
          rating,
          title: title.trim() || undefined,
          comment: comment.trim(),
          images: imageUrls.length > 0 ? imageUrls : undefined,
          orderId,
        },
      }).unwrap();

      toast.success('Review submitted successfully!');
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      setImageFiles([]);

      // Call success callback
      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err?.data?.message || 'Failed to submit review';
      toast.error(errorMessage);
    }
  };

  // Character count for comment
  const commentLength = comment.length;
  const minLength = 10;
  const maxLength = 1000;
  const progressPercent = Math.min((commentLength / minLength) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h3>
        <p className="text-sm text-gray-600">Share your experience with {productName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform"
                >
                  {star <= (hoverRating || rating) ? (
                    <StarIconSolid className="w-10 h-10 text-amber-400 drop-shadow-lg" />
                  ) : (
                    <StarIcon className="w-10 h-10 text-gray-300" />
                  )}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              {(rating > 0 || hoverRating > 0) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-2xl font-bold text-gray-900">
                    {hoverRating || rating}.0
                  </span>
                  <span className="text-sm font-semibold text-gray-600 px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
                    {ratingLabels[(hoverRating || rating) - 1]}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Review Title (Optional) */}
        <div>
          <label htmlFor="review-title" className="block text-sm font-bold text-gray-900 mb-2">
            Review Title <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience in one sentence"
            maxLength={100}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all text-gray-900 placeholder-gray-400"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              e.g., "Perfect headphones for commuting!"
            </span>
            <span className="text-xs text-gray-400">{title.length}/100</span>
          </div>
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-sm font-bold text-gray-900 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your experience with this product. What did you like or dislike? What should other buyers know?"
            rows={6}
            maxLength={maxLength}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gold focus:ring-4 focus:ring-gold/20 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            {/* Character count with progress bar */}
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 max-w-xs">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className={`h-full transition-colors ${
                      commentLength >= minLength
                        ? 'bg-green-500'
                        : 'bg-amber-400'
                    }`}
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {commentLength < minLength
                  ? `${minLength - commentLength} more characters needed`
                  : `${commentLength}/${maxLength} characters`}
              </span>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">
            Add Photos <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Help others by sharing photos of the product (Max 5 images, 5MB each)
          </p>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mb-3">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 group"
                >
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {images.length < 5 && (
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gold hover:bg-gold/5 transition-all cursor-pointer group">
              <PhotoIcon className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
              <span className="text-sm font-semibold text-gray-600 group-hover:text-gold transition-colors">
                {isUploading ? 'Uploading...' : 'Add Photos'}
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Order Verification Notice */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900">Verified Purchase</p>
              <p className="text-xs text-green-700 mt-0.5">
                Your review will be marked as a verified purchase
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <ExclamationCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900">Failed to submit review</p>
                <p className="text-xs text-red-700 mt-0.5">
                  {(error as any)?.data?.message || 'Please try again later'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || rating === 0 || comment.length < minLength}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-bold text-base hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5" />
                Submit Review
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;

