import { motion } from 'framer-motion';

const ReviewCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border-2 border-grey-200 p-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-grey-200 animate-pulse" />
          
          {/* User Info */}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-grey-200 rounded w-32 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-4 bg-grey-200 rounded w-24 animate-pulse" />
              <div className="h-3 bg-grey-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="h-6 bg-grey-200 rounded-full w-20 animate-pulse" />
      </div>

      {/* Product Info */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-grey-50 rounded-xl">
        <div className="w-12 h-12 rounded-lg bg-grey-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-grey-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-grey-200 rounded w-24 animate-pulse" />
        </div>
      </div>

      {/* Review Content */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-grey-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-grey-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-grey-200 rounded w-4/6 animate-pulse" />
      </div>

      {/* Helpful Count */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-grey-200">
        <div className="h-4 bg-grey-200 rounded w-40 animate-pulse" />
      </div>

      {/* Action Button */}
      <div className="h-12 bg-grey-200 rounded-xl w-full animate-pulse" />
    </div>
  );
};

interface ReviewsSkeletonProps {
  count?: number;
}

const ReviewsSkeleton = ({ count = 3 }: ReviewsSkeletonProps) => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 bg-grey-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-grey-200 rounded w-64 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-grey-200 p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 bg-grey-200 rounded-xl animate-pulse" />
                <div className="h-4 bg-grey-200 rounded w-16 animate-pulse" />
              </div>
              <div className="h-8 bg-grey-200 rounded w-20 animate-pulse" />
              <div className="h-3 bg-grey-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-2xl border-2 border-grey-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-grey-200 rounded-lg w-24 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
          <ReviewCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export { ReviewsSkeleton, ReviewCardSkeleton };
export default ReviewsSkeleton;













