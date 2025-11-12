import { motion } from 'framer-motion';

const ProductViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-grey-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-grey-200 animate-pulse" />
              <div>
                <div className="h-8 w-64 bg-grey-200 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-grey-200 rounded-xl animate-pulse" />
              <div className="h-10 w-32 bg-gold/20 rounded-xl animate-pulse" />
              <div className="h-10 w-10 bg-grey-200 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-1"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-2xl bg-grey-200 animate-pulse mb-4" />

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-grey-200 animate-pulse" />
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-100">
                <div className="w-6 h-6 bg-blue-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-blue-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-12 bg-blue-200 rounded animate-pulse" />
              </div>
              <div className="p-4 rounded-xl bg-green-50 border-2 border-green-100">
                <div className="w-6 h-6 bg-green-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-green-200 rounded animate-pulse mb-1" />
                <div className="h-3 w-12 bg-green-200 rounded animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 bg-green-100 rounded-full animate-pulse" />
              <div className="h-9 w-32 bg-gold/10 rounded-full animate-pulse" />
            </div>

            {/* Pricing Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gold/10 via-white to-white border-2 border-gold/20">
              <div className="h-4 w-20 bg-grey-200 rounded animate-pulse mb-2" />
              <div className="h-12 w-40 bg-grey-200 rounded animate-pulse" />
            </div>

            {/* Description */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200">
              <div className="h-6 w-32 bg-grey-200 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-grey-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-grey-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl bg-white border-2 border-grey-200">
                  <div className="h-4 w-20 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-32 bg-grey-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200">
              <div className="h-6 w-24 bg-grey-200 rounded animate-pulse mb-3" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gold/10 rounded-full animate-pulse" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-pulse {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            #f0f0f0 0%,
            #f8f8f8 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
};

export default ProductViewSkeleton;

