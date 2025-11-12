import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  PhotoIcon,
  HandThumbUpIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { Review } from '../api/reviewsApi';
import RatingStars from './RatingStars';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface ReviewCardProps {
  review: Review;
  onResponse?: (reviewId: string) => void;
  onDeleteResponse?: (reviewId: string) => void;
  isSellerView?: boolean;
}

const ReviewCard = ({ review, onResponse, onDeleteResponse, isSellerView = true }: ReviewCardProps) => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const hasResponse = review.sellerResponse?.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl border-2 border-grey-200 p-6 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white font-bold text-lg shadow-md">
              {review.userId.name.charAt(0).toUpperCase()}
            </div>
            {review.verifiedPurchase && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5 shadow-md"
              >
                <CheckBadgeIcon className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-grey-900">{review.userId.name}</h4>
              {review.verifiedPurchase && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs font-semibold rounded-full">
                  <CheckBadgeIcon className="w-3 h-3" />
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-xs text-grey-500 flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={clsx(
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
              review.status === 'approved' && 'bg-success/10 text-success',
              review.status === 'pending' && 'bg-warning/10 text-yellow-700',
              review.status === 'rejected' && 'bg-error/10 text-error'
            )}
          >
            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      {review.productId && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-grey-50 rounded-xl">
          <img
            src={review.productId.images?.[0] || '/placeholder.png'}
            alt={review.productId.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-grey-900 truncate">
              {review.productId.title}
            </p>
            <p className="text-xs text-grey-500">Product Review</p>
          </div>
        </div>
      )}

      {/* Review Title */}
      {review.title && (
        <h3 className="font-bold text-grey-900 mb-2 text-lg">{review.title}</h3>
      )}

      {/* Review Comment */}
      <p className="text-grey-700 leading-relaxed mb-4">{review.comment}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowImages(!showImages)}
            className="flex items-center gap-2 text-gold font-medium hover:text-gold-dark transition-colors mb-3"
          >
            <PhotoIcon className="w-5 h-5" />
            <span>{review.images.length} Photo{review.images.length !== 1 ? 's' : ''}</span>
          </button>
          <AnimatePresence>
            {showImages && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-4 gap-2"
              >
                {review.images.map((image, index) => (
                  <motion.img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(image)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Helpful Count */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-grey-200">
        <HandThumbUpSolidIcon className="w-5 h-5 text-grey-400" />
        <span className="text-sm text-grey-600">
          {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
        </span>
      </div>

      {/* Seller Response Section */}
      {isSellerView && (
        <AnimatePresence mode="wait">
          {hasResponse ? (
            <motion.div
              key="response"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-gold-pale to-gold/5 rounded-xl p-4 border-l-4 border-gold"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-gold" />
                  <span className="font-semibold text-gold-dark">Your Response</span>
                </div>
                {onDeleteResponse && (
                  <button
                    onClick={() => onDeleteResponse(review._id)}
                    className="text-error hover:text-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-grey-800 leading-relaxed">{review.sellerResponse.message}</p>
              <p className="text-xs text-grey-500 mt-2">
                Responded {formatDistanceToNow(new Date(review.sellerResponse.respondedAt), { addSuffix: true })}
              </p>
            </motion.div>
          ) : (
            <motion.button
              key="no-response"
              onClick={() => onResponse?.(review._id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              <span>Respond to Review</span>
            </motion.button>
          )}
        </AnimatePresence>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt="Review"
              className="max-w-full max-h-full rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReviewCard;

