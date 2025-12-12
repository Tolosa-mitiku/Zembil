import { motion } from 'framer-motion';

export const ReviewCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar skeleton */}
        <div className="w-12 h-12 rounded-full bg-grey-200" />

        {/* User info skeleton */}
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-grey-200 rounded w-32" />
          <div className="flex items-center gap-2">
            <div className="h-4 bg-grey-200 rounded w-24" />
            <div className="h-4 bg-grey-200 rounded w-20" />
          </div>
        </div>
      </div>

      {/* Title skeleton */}
      <div className="h-6 bg-grey-200 rounded w-3/4 mb-2" />

      {/* Comment skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-grey-200 rounded w-full" />
        <div className="h-4 bg-grey-200 rounded w-full" />
        <div className="h-4 bg-grey-200 rounded w-2/3" />
      </div>

      {/* Footer skeleton */}
      <div className="pt-4 border-t border-grey-100">
        <div className="h-10 bg-grey-200 rounded-lg w-32" />
      </div>
    </div>
  );
};

export const ReviewsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-grey-50 to-grey-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-grey-200 rounded w-64 mb-2" />
          <div className="h-5 bg-grey-200 rounded w-96" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats card skeleton */}
            <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6 animate-pulse">
              <div className="h-20 bg-grey-200 rounded mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 bg-grey-200 rounded w-12" />
                    <div className="flex-1 h-3 bg-grey-200 rounded" />
                    <div className="h-3 bg-grey-200 rounded w-8" />
                  </div>
                ))}
              </div>
            </div>

            {/* Filter card skeleton */}
            <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-grey-200 rounded w-32 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-grey-200 rounded" />
                ))}
              </div>
            </div>
          </div>

          {/* Reviews list skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <ReviewCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};















