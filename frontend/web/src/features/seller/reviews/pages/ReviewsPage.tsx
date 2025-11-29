import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useGetSellerReviewsQuery } from '../api/reviewsApi';
import ReviewCard from '../components/ReviewCard';
import ResponseModal from '../components/ResponseModal';
import RatingStars from '../components/RatingStars';
import ReviewsSkeleton from '../components/ReviewsSkeleton';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  gradient: string;
  delay?: number;
}

const StatsCard = ({ icon: Icon, label, value, subtitle, color, gradient, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      className="bg-white rounded-2xl border-2 border-grey-200 p-6 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={clsx('p-3 rounded-xl', gradient, 'group-hover:scale-110 transition-transform')}>
          <Icon className={clsx('w-6 h-6', color)} />
        </div>
        {subtitle && (
          <span className="text-xs font-semibold text-success flex items-center gap-1 bg-success/10 px-2 py-1 rounded-full">
            <ArrowTrendingUpIcon className="w-3 h-3" />
            {subtitle}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-grey-900">{value}</p>
        <p className="text-sm text-grey-600">{label}</p>
      </div>
    </motion.div>
  );
};

const ReviewsPage = () => {
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('-createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);

  // Fetch reviews data
  const { data, isLoading, isFetching } = useGetSellerReviewsQuery({
    page,
    limit: 10,
    rating: ratingFilter,
    sort: sortBy,
  });

  // Calculate stats
  const stats = useMemo(() => {
    if (!data?.data) {
      return {
        totalReviews: 0,
        averageRating: 0,
        pendingResponses: 0,
        recentReviews: 0,
      };
    }

    const reviews = data.data;
    const totalReviews = data.pagination.total || reviews.length;
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    const pendingResponses = reviews.filter(r => !r.sellerResponse).length;
    const recentReviews = reviews.filter(
      r => new Date(r.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    return {
      totalReviews,
      averageRating,
      pendingResponses,
      recentReviews,
    };
  }, [data]);

  // Filter reviews by search query
  const filteredReviews = useMemo(() => {
    if (!data?.data) return [];
    if (!searchQuery.trim()) return data.data;

    const query = searchQuery.toLowerCase();
    return data.data.filter(
      review =>
        review.comment.toLowerCase().includes(query) ||
        review.title?.toLowerCase().includes(query) ||
        review.userId.name.toLowerCase().includes(query) ||
        review.productId.title.toLowerCase().includes(query)
    );
  }, [data?.data, searchQuery]);

  // Rating distribution
  const ratingDistribution = useMemo(() => {
    if (!data?.data) return [];
    
    const distribution = [5, 4, 3, 2, 1].map(rating => {
      const count = data.data.filter(r => r.rating === rating).length;
      const percentage = data.data.length > 0 ? (count / data.data.length) * 100 : 0;
      return { rating, count, percentage };
    });

    return distribution;
  }, [data?.data]);

  const handleResponseClick = (reviewId: string) => {
    const review = data?.data.find(r => r._id === reviewId);
    if (review) {
      setSelectedReview(review);
      setResponseModalOpen(true);
    }
  };

  const handleDeleteResponse = async (reviewId: string) => {
    // Implement delete response logic
    console.log('Delete response for review:', reviewId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ReviewsSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-gold via-gold-dark to-gold-dark rounded-3xl p-8 text-white shadow-xl"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <SparklesIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Product Reviews</h1>
          </div>
          <p className="text-gold-pale/90 text-lg">
            View, manage, and respond to customer feedback
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        {/* Floating stars */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-4 right-4 text-gold-pale/20"
        >
          <StarSolidIcon className="w-12 h-12" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-4 left-4 text-gold-pale/20"
        >
          <StarSolidIcon className="w-16 h-16" />
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={StarIcon}
          label="Total Reviews"
          value={stats.totalReviews}
          color="text-gold"
          gradient="bg-gradient-to-br from-gold/20 to-gold/10"
          delay={0.1}
        />
        <StatsCard
          icon={ChartBarIcon}
          label="Average Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle="+0.3"
          color="text-success"
          gradient="bg-gradient-to-br from-success/20 to-success/10"
          delay={0.2}
        />
        <StatsCard
          icon={ChatBubbleLeftRightIcon}
          label="Pending Responses"
          value={stats.pendingResponses}
          color="text-warning"
          gradient="bg-gradient-to-br from-warning/20 to-warning/10"
          delay={0.3}
        />
        <StatsCard
          icon={ClockIcon}
          label="Last 7 Days"
          value={stats.recentReviews}
          subtitle="+12%"
          color="text-info"
          gradient="bg-gradient-to-br from-info/20 to-info/10"
          delay={0.4}
        />
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border-2 border-grey-200 p-6"
      >
        <h3 className="text-xl font-bold text-grey-900 mb-6 flex items-center gap-2">
          <ChartBarIcon className="w-6 h-6 text-gold" />
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {ratingDistribution.map(({ rating, count, percentage }, index) => (
            <motion.div
              key={rating}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-1 w-24">
                <span className="font-semibold text-grey-900 w-4">{rating}</span>
                <StarSolidIcon className="w-4 h-4 text-gold" />
              </div>
              <div className="flex-1 h-3 bg-grey-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  className="h-full bg-gradient-to-r from-gold to-gold-dark rounded-full"
                />
              </div>
              <span className="text-sm font-semibold text-grey-700 w-16 text-right">
                {count} ({percentage.toFixed(0)}%)
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border-2 border-grey-200 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
            <input
              type="text"
              placeholder="Search reviews by product, customer, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-grey-500" />
            <div className="flex gap-2">
              <button
                onClick={() => setRatingFilter(undefined)}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  ratingFilter === undefined
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
                )}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1',
                    ratingFilter === rating
                      ? 'bg-gold text-white shadow-md'
                      : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
                  )}
                >
                  <StarSolidIcon className="w-4 h-4" />
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border-2 border-grey-200 rounded-xl focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none transition-all bg-white"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-rating">Highest Rating</option>
            <option value="rating">Lowest Rating</option>
            <option value="-helpful">Most Helpful</option>
          </select>
        </div>
      </motion.div>

      {/* Reviews List */}
      <AnimatePresence mode="popLayout">
        {filteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl border-2 border-grey-200 p-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-grey-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-10 h-10 text-grey-400" />
              </div>
              <h3 className="text-xl font-bold text-grey-900 mb-2">No Reviews Found</h3>
              <p className="text-grey-600">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Reviews will appear here once customers start reviewing your products'}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ReviewCard
                  review={review}
                  onResponse={handleResponseClick}
                  onDeleteResponse={handleDeleteResponse}
                  isSellerView={true}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 pt-6"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border-2 border-grey-200 rounded-lg font-medium text-grey-700 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(data.pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={clsx(
                  'w-10 h-10 rounded-lg font-medium transition-all',
                  page === i + 1
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-grey-100 text-grey-700 hover:bg-grey-200'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === data.pagination.totalPages}
            className="px-4 py-2 border-2 border-grey-200 rounded-lg font-medium text-grey-700 hover:border-gold hover:text-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Loading Overlay */}
      <AnimatePresence>
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <span className="text-grey-900 font-semibold">Updating reviews...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Response Modal */}
      {selectedReview && (
        <ResponseModal
          isOpen={responseModalOpen}
          onClose={() => {
            setResponseModalOpen(false);
            setSelectedReview(null);
          }}
          reviewId={selectedReview._id}
          reviewerName={selectedReview.userId.name}
          reviewContent={selectedReview.comment}
          rating={selectedReview.rating}
        />
      )}
    </div>
  );
};

export default ReviewsPage;
