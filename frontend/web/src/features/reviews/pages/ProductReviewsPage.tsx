import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  FunnelIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  StarRating,
  RatingBreakdown,
  ReviewCard,
  ReviewForm,
  ReviewsPageSkeleton,
  type ReviewFormData,
} from '../components';
import {
  useGetProductReviewsQuery,
  useAddProductReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
} from '../api/reviewsApi';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const ITEMS_PER_PAGE = 10;

const ProductReviewsPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State
  const [page, setPage] = useState(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('-createdAt');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);

  // API queries
  const {
    data: reviewsData,
    isLoading,
    isFetching,
  } = useGetProductReviewsQuery({
    productId: productId!,
    page,
    limit: ITEMS_PER_PAGE,
    rating: selectedRating || undefined,
    sort: sortBy,
  });

  const [addReview, { isLoading: isAdding }] = useAddProductReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [markHelpful] = useMarkReviewHelpfulMutation();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedRating, sortBy]);

  const handleAddReview = async (formData: ReviewFormData) => {
    try {
      await addReview({
        productId: productId!,
        review: formData,
      }).unwrap();
      toast.success('Review submitted successfully!');
      setShowReviewForm(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    }
  };

  const handleUpdateReview = async (formData: ReviewFormData) => {
    if (!editingReview) return;

    try {
      await updateReview({
        reviewId: editingReview,
        review: formData,
      }).unwrap();
      toast.success('Review updated successfully!');
      setEditingReview(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update review');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteReview(reviewId).unwrap();
      toast.success('Review deleted successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete review');
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to mark reviews as helpful');
      return;
    }

    try {
      await markHelpful(reviewId).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to mark review as helpful');
    }
  };

  if (isLoading) {
    return <ReviewsPageSkeleton />;
  }

  if (!reviewsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-grey-50 to-grey-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-grey-500 mb-4">Failed to load reviews</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { data: reviews, pagination, ratingDistribution } = reviewsData;
  const totalReviews = pagination.total;
  const averageRating =
    ratingDistribution.reduce((sum, item) => sum + item._id * item.count, 0) /
    (totalReviews || 1);

  const editingReviewData = reviews.find((r) => r._id === editingReview);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-grey-50 to-grey-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-grey-100 shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-grey-50 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-grey-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-grey-900 flex items-center gap-3">
                  Customer Reviews
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200"
                  >
                    <StarIcon className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-700">
                      {averageRating.toFixed(1)}
                    </span>
                  </motion.div>
                </h1>
                <p className="text-grey-600 mt-1">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span>Write a Review</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Stats & Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating Summary Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6 sticky top-32"
            >
              {/* Overall Rating */}
              <div className="text-center mb-6 pb-6 border-b border-grey-100">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-200 mb-4"
                >
                  <span className="text-5xl font-bold text-yellow-700">
                    {averageRating.toFixed(1)}
                  </span>
                  <StarRating rating={averageRating} size="sm" className="mt-2" />
                </motion.div>
                <p className="text-sm text-grey-600 font-medium">
                  Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Breakdown */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-grey-900 mb-4 flex items-center gap-2">
                  <FunnelIcon className="w-4 h-4" />
                  Filter by Rating
                </h3>
                <RatingBreakdown
                  ratingDistribution={ratingDistribution}
                  totalReviews={totalReviews}
                  onFilterByRating={setSelectedRating}
                  selectedRating={selectedRating}
                />
              </div>

              {/* Active Filter Badge */}
              {selectedRating && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedRating(null)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold-pale border-2 border-gold rounded-xl text-gold-dark font-semibold hover:bg-gold hover:text-white transition-all"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Showing {selectedRating}-star reviews</span>
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sort Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-white rounded-xl border border-grey-100 shadow-sm px-6 py-4"
            >
              <span className="text-sm font-semibold text-grey-700">
                Showing {reviews.length} of {totalReviews} reviews
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-grey-200 rounded-lg text-sm font-medium text-grey-700 focus:border-gold focus:ring-2 focus:ring-gold focus:ring-offset-0 transition-all bg-white"
              >
                <option value="-createdAt">Most Recent</option>
                <option value="createdAt">Oldest First</option>
                <option value="-rating">Highest Rating</option>
                <option value="rating">Lowest Rating</option>
                <option value="-helpful">Most Helpful</option>
              </select>
            </motion.div>

            {/* Reviews */}
            <AnimatePresence mode="wait">
              {isFetching && page === 1 ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
                  <p className="mt-4 text-grey-600 font-medium">Loading reviews...</p>
                </motion.div>
              ) : reviews.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl border-2 border-dashed border-grey-200 p-12 text-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-pale to-gold-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIcon className="w-12 h-12 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-grey-900 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-grey-600 mb-6">
                    {selectedRating
                      ? `No ${selectedRating}-star reviews found. Try a different filter.`
                      : 'Be the first to share your experience with this product!'}
                  </p>
                  {isAuthenticated && !selectedRating && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowReviewForm(true)}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                      <span>Write the First Review</span>
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ReviewCard
                        review={review}
                        onMarkHelpful={handleMarkHelpful}
                        onEdit={
                          user?.uid === review.userId._id
                            ? () => setEditingReview(review._id)
                            : undefined
                        }
                        onDelete={
                          user?.uid === review.userId._id
                            ? handleDeleteReview
                            : undefined
                        }
                        isMarkedHelpful={review.helpfulBy.includes(user?.uid || '')}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-8"
              >
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || isFetching}
                  className="px-4 py-2 border border-grey-200 rounded-lg font-medium text-grey-700 hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((pageNum) => {
                    // Show first, last, current, and adjacent pages
                    return (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      Math.abs(pageNum - page) <= 1
                    );
                  })
                  .map((pageNum, index, array) => {
                    // Add ellipsis if there's a gap
                    const prevPageNum = array[index - 1];
                    const showEllipsis = prevPageNum && pageNum - prevPageNum > 1;

                    return (
                      <div key={pageNum} className="flex items-center gap-2">
                        {showEllipsis && (
                          <span className="px-2 text-grey-400">...</span>
                        )}
                        <button
                          onClick={() => setPage(pageNum)}
                          disabled={isFetching}
                          className={clsx(
                            'px-4 py-2 rounded-lg font-medium transition-all',
                            page === pageNum
                              ? 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-lg'
                              : 'border border-grey-200 text-grey-700 hover:bg-grey-50'
                          )}
                        >
                          {pageNum}
                        </button>
                      </div>
                    );
                  })}

                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages || isFetching}
                  className="px-4 py-2 border border-grey-200 rounded-lg font-medium text-grey-700 hover:bg-grey-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <ReviewForm
            onSubmit={handleAddReview}
            onCancel={() => setShowReviewForm(false)}
            isLoading={isAdding}
          />
        )}

        {editingReview && editingReviewData && (
          <ReviewForm
            onSubmit={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
            initialData={{
              rating: editingReviewData.rating,
              title: editingReviewData.title || '',
              comment: editingReviewData.comment,
              images: editingReviewData.images || [],
            }}
            isLoading={isUpdating}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductReviewsPage;

















