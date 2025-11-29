import Shimmer from '@/shared/components/Shimmer';

const CustomerManagementSkeleton = () => {
  return (
    <div className="min-h-screen bg-grey-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Shimmer className="h-12 w-96 rounded-lg mb-3" />
          <Shimmer className="h-6 w-64 rounded-lg" />
        </div>

        {/* Stats Cards Skeleton - 8 cards in 4x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-grey-200 p-6 animate-pulse"
            >
              {/* Icon and Trend */}
              <div className="flex items-start justify-between mb-4">
                <Shimmer className="w-14 h-14 rounded-xl" />
                <Shimmer className="w-16 h-6 rounded-full" />
              </div>

              {/* Title */}
              <Shimmer className="h-4 w-24 rounded mb-2" />

              {/* Value */}
              <Shimmer className="h-10 w-20 rounded mb-1" />

              {/* Subtitle */}
              <Shimmer className="h-3 w-32 rounded mt-2" />

              {/* Gradient bar */}
              <Shimmer className="h-1 w-full rounded-full mt-4" />
            </div>
          ))}
        </div>

        {/* Search Bar Skeleton */}
        <div className="bg-white rounded-xl border-2 border-grey-200 shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <Shimmer className="flex-1 h-12 rounded-lg" />
            <Shimmer className="w-32 h-12 rounded-lg" />
            <Shimmer className="hidden md:block w-32 h-12 rounded-lg" />
          </div>
        </div>

        {/* Customer Cards Grid Skeleton - 12 cards in 3x4 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-grey-200 overflow-hidden animate-pulse"
            >
              {/* Gradient Header */}
              <div className="h-24 bg-grey-200 relative overflow-hidden">
                <Shimmer className="absolute inset-0" variant="dark" />
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <Shimmer className="w-20 h-6 rounded-full" />
                </div>
              </div>

              {/* Profile Picture */}
              <div className="relative -mt-12 px-6">
                <div className="relative">
                  <Shimmer className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg" />
                  {/* Role badge */}
                  <div className="absolute -bottom-2 -right-2">
                    <Shimmer className="w-10 h-10 rounded-xl border-2 border-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-4">
                {/* Name */}
                <Shimmer className="h-6 w-32 rounded mb-2" />
                {/* Email */}
                <Shimmer className="h-4 w-48 rounded mb-4" />

                {/* Role Badge */}
                <Shimmer className="h-8 w-24 rounded-lg mb-4" />

                {/* Info Grid */}
                <div className="space-y-3 mb-4">
                  <Shimmer className="h-4 w-full rounded" />
                  <Shimmer className="h-4 w-3/4 rounded" />
                </div>

                {/* Button */}
                <Shimmer className="h-10 w-full rounded-lg" />
              </div>

              {/* Bottom bar */}
              <Shimmer className="h-1 w-full" />
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-4">
          <Shimmer className="w-32 h-12 rounded-lg" />
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <Shimmer key={index} className="w-12 h-12 rounded-lg" />
            ))}
          </div>
          <Shimmer className="w-32 h-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CustomerManagementSkeleton;

