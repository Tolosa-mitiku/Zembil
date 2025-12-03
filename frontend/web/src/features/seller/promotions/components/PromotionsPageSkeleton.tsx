import { motion } from 'framer-motion';

// Shimmer effect component
const Shimmer = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer" />
    <style>{`
      .shimmer-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
      }
      .shimmer {
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(167, 139, 250, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: shimmer 2s infinite;
        transform: skewX(-20deg);
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-100%) skewX(-20deg);
        }
        100% {
          transform: translateX(200%) skewX(-20deg);
        }
      }
    `}</style>
  </div>
);

const PromotionsPageSkeleton = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero Banner Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-200 via-pink-200 to-orange-200 p-8 shadow-2xl"
      >
        <div className="relative flex items-center justify-between mb-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              {/* Icon placeholder */}
              <div className="rounded-2xl bg-white/30 backdrop-blur-sm">
                <div className="h-14 w-14 bg-white/20 rounded-2xl animate-pulse" />
              </div>
              <div className="flex-1">
                {/* Title */}
                <div className="h-10 w-64 bg-white/30 rounded-lg animate-pulse mb-2" />
                {/* Subtitle */}
                <div className="h-5 w-80 bg-white/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Button placeholder */}
          <div className="h-11 w-44 bg-white/40 rounded-lg animate-pulse" />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white/20 backdrop-blur-md p-4 border border-white/30">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/30 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-white/30 rounded animate-pulse" />
                  <div className="h-7 w-16 bg-white/40 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs Skeleton */}
      <div className="flex items-center space-x-2 border-b border-grey-200">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-40 bg-grey-100 rounded-t-lg animate-pulse" />
        ))}
      </div>

      {/* Content Area - Overview/Active Promotions Style */}
      <div className="space-y-6">
        {/* Performance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-grey-100 p-6">
                <Shimmer />
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="h-4 w-24 bg-grey-200 rounded animate-pulse" />
                    <div className="h-8 w-20 bg-grey-300 rounded animate-pulse" />
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl animate-pulse" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Chart Card Skeleton */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-grey-100 p-6">
          <Shimmer />
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-grey-100 pb-5">
              <div>
                <div className="h-6 w-48 bg-grey-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-grey-100 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-80 bg-grey-50 rounded-xl flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 bg-grey-200 rounded-full mx-auto animate-pulse" />
                <div className="h-5 w-48 bg-grey-200 rounded mx-auto animate-pulse" />
                <div className="h-4 w-64 bg-grey-100 rounded mx-auto animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Promotion Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-grey-100">
                {/* Image Header Skeleton */}
                <div className="relative h-48 bg-gradient-to-br from-grey-200 via-grey-100 to-grey-200 animate-pulse">
                  <Shimmer />
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 h-14 w-24 bg-gradient-to-br from-orange-300 to-red-300 rounded-full animate-pulse" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 h-7 w-20 bg-green-200 rounded-full animate-pulse" />
                  
                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-6 w-3/4 bg-white/60 rounded animate-pulse" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Price Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-12 bg-grey-200 rounded animate-pulse" />
                      <div className="flex items-center space-x-2">
                        <div className="h-7 w-20 bg-green-200 rounded animate-pulse" />
                        <div className="h-5 w-16 bg-grey-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-3 w-12 bg-grey-200 rounded animate-pulse ml-auto" />
                      <div className="h-7 w-16 bg-orange-200 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="h-12 bg-grey-50 rounded-lg animate-pulse" />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-grey-200">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="text-center space-y-2">
                        <div className="h-4 w-4 bg-grey-200 rounded mx-auto animate-pulse" />
                        <div className="h-6 w-12 bg-grey-200 rounded mx-auto animate-pulse" />
                        <div className="h-3 w-10 bg-grey-100 rounded mx-auto animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="h-9 flex-1 bg-grey-200 rounded animate-pulse" />
                    <div className="h-9 flex-1 bg-gradient-to-r from-purple-200 to-pink-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Promotion Types Grid (Alternative Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[
            { from: 'from-orange-200', to: 'to-red-200' },
            { from: 'from-green-200', to: 'to-emerald-200' },
            { from: 'from-purple-200', to: 'to-pink-200' },
            { from: 'from-yellow-200', to: 'to-amber-200' },
          ].map((colors, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border-2 border-grey-100 p-6">
                <Shimmer />
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className={`h-16 w-16 bg-gradient-to-br ${colors.from} ${colors.to} rounded-2xl animate-pulse`} />
                    <div className="h-6 w-16 bg-blue-200 rounded-full animate-pulse" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-grey-300 rounded animate-pulse" />
                    <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <div className={`h-2 w-2 bg-gradient-to-br ${colors.from} ${colors.to} rounded-full animate-pulse`} />
                        <div className="h-3 w-32 bg-grey-200 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <div className={`h-10 w-full bg-gradient-to-r ${colors.from} ${colors.to} rounded-lg animate-pulse`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips Card Skeleton */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6">
          <Shimmer />
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="h-6 w-64 bg-purple-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-purple-100 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="h-2 w-2 bg-purple-300 rounded-full mt-1.5 animate-pulse" />
                    <div className="h-4 flex-1 bg-purple-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline shimmer animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default PromotionsPageSkeleton;













