import { motion } from 'framer-motion';
import { StarRating } from './StarRating';
import { Review } from '../types/review.types';
import {
  HandThumbUpIcon,
  CheckBadgeIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

interface ReviewCardProps {
  review: Review;
  onMarkHelpful?: (reviewId: string) => void;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  isMarkedHelpful?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onMarkHelpful,
  onEdit,
  onDelete,
  isMarkedHelpful = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user } = useAuth();

  const isOwnReview = user?.uid === review.userId._id;

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setImageModalOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-grey-100 shadow-sm hover:shadow-md transition-all duration-300 p-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {review.userId.image ? (
                <img
                  src={review.userId.image}
                  alt={review.userId.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-grey-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-pale to-gold-light flex items-center justify-center ring-2 ring-grey-100">
                  <span className="text-gold-dark font-bold text-lg">
                    {review.userId.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User info and rating */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-grey-900 truncate">
                  {review.userId.name}
                </h4>
                {review.verifiedPurchase && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full"
                  >
                    <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Verified Purchase
                    </span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-grey-500">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions menu */}
          {isOwnReview && (onEdit || onDelete) && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-grey-50 rounded-lg transition-colors"
              >
                <EllipsisVerticalIcon className="w-5 h-5 text-grey-500" />
              </button>

              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-grey-100 py-2 z-10"
                >
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(review._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-grey-50 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4 text-grey-600" />
                      <span className="text-sm font-medium text-grey-700">Edit Review</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(review._id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">Delete Review</span>
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Review title */}
        {review.title && (
          <h5 className="font-semibold text-grey-900 mb-2">{review.title}</h5>
        )}

        {/* Review comment */}
        <p className="text-grey-700 leading-relaxed mb-4">{review.comment}</p>

        {/* Review images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {review.images.map((image, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleImageClick(image)}
                className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-grey-100 hover:border-gold transition-colors"
              >
                <img
                  src={image}
                  alt={`Review ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        )}

        {/* Seller response */}
        {review.sellerResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-gradient-to-br from-gold-pale/30 to-gold-light/20 border-l-4 border-gold rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <span className="font-semibold text-grey-900 text-sm">
                Seller Response
              </span>
              <span className="text-xs text-grey-500">
                {formatDistanceToNow(new Date(review.sellerResponse.respondedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="text-sm text-grey-700 leading-relaxed">
              {review.sellerResponse.message}
            </p>
          </motion.div>
        )}

        {/* Footer actions */}
        <div className="mt-4 pt-4 border-t border-grey-100 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMarkHelpful?.(review._id)}
            disabled={!onMarkHelpful}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              isMarkedHelpful
                ? 'bg-gold text-white'
                : 'bg-grey-50 text-grey-700 hover:bg-grey-100',
              !onMarkHelpful && 'cursor-default'
            )}
          >
            {isMarkedHelpful ? (
              <HandThumbUpIconSolid className="w-5 h-5" />
            ) : (
              <HandThumbUpIcon className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">
              Helpful {review.helpful > 0 && `(${review.helpful})`}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Image Modal */}
      {imageModalOpen && selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setImageModalOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh]"
          >
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-grey-300 transition-colors"
            >
              <span className="text-3xl">×</span>
            </button>
            <img
              src={selectedImage}
              alt="Review"
              className="max-w-full max-h-[90vh] rounded-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};













