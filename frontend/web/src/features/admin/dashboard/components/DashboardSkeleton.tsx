import { motion } from 'framer-motion';

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
      }
      .shimmer {
        width: 50%;
        height: 100%;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
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

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Hero Banner Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-200 via-blue-200 to-pink-200 p-8 h-48 shadow-2xl"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 bg-white/30 rounded-lg relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-6 w-48 bg-white/20 rounded-lg relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-12 w-96 bg-white/25 rounded-xl relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-32 bg-white/30 rounded-xl relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-12 w-12 bg-white/30 rounded-xl relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector Skeleton */}
      <div className="bg-white border-b border-grey-200 py-4 rounded-lg shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-96 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-28 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-10 w-28 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Skeleton - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-24 bg-grey-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-10 w-32 bg-grey-300 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              <div className="w-14 h-14 bg-grey-200 rounded-xl relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-grey-200 rounded-lg relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-3 w-20 bg-grey-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="mt-4 h-12 w-full bg-grey-100 rounded relative overflow-hidden">
              <Shimmer />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary KPI Cards Skeleton - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i - 4) * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-28 bg-grey-200 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
                <div className="h-10 w-24 bg-grey-300 rounded relative overflow-hidden">
                  <Shimmer />
                </div>
              </div>
              <div className="w-14 h-14 bg-grey-200 rounded-xl relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="h-6 w-16 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sales Chart Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-grey-300 rounded relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-4 w-56 bg-grey-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-64 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-10 w-24 bg-grey-200 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
        </div>
        <div className="h-96 bg-grey-100 rounded-lg relative overflow-hidden">
          <Shimmer />
        </div>
      </motion.div>

      {/* Order Kanban Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
      >
        <div className="mb-6 space-y-2">
          <div className="h-6 w-40 bg-grey-300 rounded relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-4 w-64 bg-grey-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="space-y-3">
              <div className="h-16 bg-grey-100 rounded-xl p-4 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="space-y-3">
                {[1, 2].map((card) => (
                  <div
                    key={card}
                    className="h-40 bg-grey-50 border-2 border-grey-200 rounded-xl p-4 relative overflow-hidden"
                  >
                    <Shimmer />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Product Performance Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
          >
            <div className="mb-6 space-y-2">
              <div className="h-6 w-40 bg-grey-300 rounded relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-4 w-48 bg-grey-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 rounded-xl">
                  <div className="w-16 h-16 bg-grey-200 rounded-lg relative overflow-hidden flex-shrink-0">
                    <Shimmer />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full bg-grey-200 rounded relative overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="h-3 w-3/4 bg-grey-200 rounded relative overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="h-2 w-full bg-grey-200 rounded-full relative overflow-hidden">
                      <Shimmer />
                    </div>
                  </div>
                  <div className="h-8 w-16 bg-grey-200 rounded-lg relative overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Customer Insights Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
          >
            <div className="mb-6 space-y-2">
              <div className="h-6 w-32 bg-grey-300 rounded relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-4 w-40 bg-grey-200 rounded relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <div className="h-64 bg-grey-100 rounded-lg relative overflow-hidden">
              <Shimmer />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts Panel Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-grey-300 rounded relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="h-4 w-56 bg-grey-200 rounded relative overflow-hidden">
              <Shimmer />
            </div>
          </div>
          <div className="h-8 w-8 bg-grey-300 rounded-full relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-grey-50 border-2 border-grey-200 rounded-xl p-5 relative overflow-hidden"
            >
              <Shimmer />
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-purple-50 rounded-xl p-6 shadow-sm border border-grey-100"
      >
        <div className="mb-4 space-y-2">
          <div className="h-6 w-48 bg-purple-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-4 w-64 bg-purple-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="h-24 bg-white rounded-xl relative overflow-hidden mb-4">
          <Shimmer />
        </div>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-2 w-2 bg-grey-300 rounded-full relative overflow-hidden">
              <Shimmer />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-grey-100"
      >
        <div className="mb-6 space-y-2">
          <div className="h-6 w-32 bg-grey-300 rounded relative overflow-hidden">
            <Shimmer />
          </div>
          <div className="h-4 w-48 bg-grey-200 rounded relative overflow-hidden">
            <Shimmer />
          </div>
        </div>
        <div className="space-y-8">
          {[1, 2, 3, 4].map((section) => (
            <div key={section}>
              <div className="h-4 w-40 bg-grey-300 rounded mb-4 relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((card) => (
                  <div
                    key={card}
                    className="h-32 bg-grey-50 border-2 border-grey-200 rounded-xl p-4 relative overflow-hidden"
                  >
                    <Shimmer />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSkeleton;

