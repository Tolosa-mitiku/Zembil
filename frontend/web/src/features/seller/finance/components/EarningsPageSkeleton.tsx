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
        border-radius: inherit;
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

const EarningsPageSkeleton = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {/* Icon skeleton */}
            <div className="relative w-8 h-8 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
              <Shimmer />
            </div>
            {/* Title skeleton */}
            <div className="relative h-10 w-64 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
              <Shimmer />
            </div>
          </div>
          {/* Description skeleton */}
          <div className="relative h-6 w-96 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
            <Shimmer />
          </div>
        </div>
        {/* Action buttons skeleton */}
        <div className="flex gap-3">
          <div className="relative h-10 w-24 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
          <div className="relative h-10 w-36 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
            <Shimmer />
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { gradient: 'from-purple-500 via-purple-600 to-purple-700', delay: 0 },
          { gradient: 'from-green-500 via-green-600 to-emerald-600', delay: 0.1 },
          { gradient: 'from-orange-500 via-orange-600 to-amber-600', delay: 0.2 },
          { gradient: 'from-blue-500 via-blue-600 to-indigo-600', delay: 0.3 },
        ].map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-6 shadow-lg`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white blur-2xl animate-pulse" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title skeleton */}
                  <div className="h-4 w-32 bg-white/30 rounded mb-3 animate-pulse" />
                  
                  {/* Amount skeleton */}
                  <div className="h-8 w-40 bg-white/40 rounded-lg mb-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  
                  {/* Trend skeleton */}
                  {index !== 2 && (
                    <div className="h-3 w-36 bg-white/20 rounded animate-pulse" style={{ animationDelay: '0.4s' }} />
                  )}
                </div>
                {/* Icon skeleton */}
                <div className="p-3 bg-white/20 rounded-xl animate-pulse" style={{ animationDelay: '0.3s' }}>
                  <div className="w-7 h-7 bg-white/30 rounded" />
                </div>
              </div>
            </div>

            {/* Shimmer effect */}
            <Shimmer />
          </motion.div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Trend Chart Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Icon skeleton */}
                <div className="relative p-2 bg-gold-pale rounded-lg overflow-hidden">
                  <div className="w-6 h-6 bg-gold/30 rounded animate-pulse" />
                </div>
                <div>
                  {/* Title skeleton */}
                  <div className="relative h-6 w-40 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded mb-2 overflow-hidden">
                    <Shimmer />
                  </div>
                  {/* Subtitle skeleton */}
                  <div className="relative h-4 w-48 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                    <Shimmer />
                  </div>
                </div>
              </div>
              {/* Dropdown skeleton */}
              <div className="relative h-10 w-32 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
                <Shimmer />
              </div>
            </div>
            
            {/* Chart skeleton */}
            <div className="relative h-[300px] bg-gradient-to-r from-grey-100 via-grey-50 to-grey-100 rounded-lg overflow-hidden">
              {/* Simulated chart lines */}
              <div className="absolute inset-0 p-8">
                <div className="h-full flex items-end justify-around gap-4">
                  {[60, 75, 55, 80, 90, 85].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gold/20 rounded-t-lg animate-pulse"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              <Shimmer />
            </div>
          </div>
        </motion.div>

        {/* Distribution Chart Skeleton */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              {/* Icon skeleton */}
              <div className="relative p-2 bg-purple-50 rounded-lg overflow-hidden">
                <div className="w-6 h-6 bg-purple-600/30 rounded animate-pulse" />
              </div>
              <div>
                {/* Title skeleton */}
                <div className="relative h-6 w-32 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded mb-2 overflow-hidden">
                  <Shimmer />
                </div>
                {/* Subtitle skeleton */}
                <div className="relative h-4 w-24 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
            
            {/* Doughnut chart skeleton */}
            <div className="relative h-[300px] flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-[40px] border-grey-200 animate-pulse" />
                {/* Segments with colors */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-green-200/40 animate-pulse" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)' }} />
                  <div className="absolute inset-0 bg-yellow-200/40 animate-pulse" style={{ clipPath: 'polygon(50% 50%, 100% 100%, 0% 100%)', animationDelay: '0.2s' }} />
                  <div className="absolute inset-0 bg-gold/20 animate-pulse" style={{ clipPath: 'polygon(50% 50%, 0% 100%, 0% 0%, 50% 0%)', animationDelay: '0.4s' }} />
                </div>
                {/* Center hole */}
                <div className="absolute inset-[40px] rounded-full bg-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transaction History Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="bg-white rounded-2xl border border-grey-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Icon skeleton */}
              <div className="relative p-2 bg-blue-50 rounded-lg overflow-hidden">
                <div className="w-6 h-6 bg-blue-600/30 rounded animate-pulse" />
              </div>
              <div>
                {/* Title skeleton */}
                <div className="relative h-6 w-48 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded mb-2 overflow-hidden">
                  <Shimmer />
                </div>
                {/* Subtitle skeleton */}
                <div className="relative h-4 w-56 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                  <Shimmer />
                </div>
              </div>
            </div>
            {/* Filter controls skeleton */}
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-24 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
                <Shimmer />
              </div>
              <div className="relative h-10 w-32 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg overflow-hidden">
                <Shimmer />
              </div>
            </div>
          </div>

          {/* Transaction cards skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + (index * 0.05) }}
                className="relative p-4 rounded-xl border-2 border-grey-100 bg-grey-50/50 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icon skeleton */}
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <div className="w-6 h-6 bg-gold/20 rounded animate-pulse" />
                    </div>
                    
                    <div className="flex-1">
                      {/* Order number and status skeleton */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative h-5 w-32 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                          <Shimmer />
                        </div>
                        <div className="relative h-6 w-16 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-full overflow-hidden">
                          <Shimmer />
                        </div>
                      </div>
                      
                      {/* Date and time skeleton */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-4 w-32 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                          <Shimmer />
                        </div>
                        <div className="relative h-4 w-40 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                          <Shimmer />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount skeleton */}
                  <div className="text-right">
                    <div className="relative h-8 w-28 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded-lg mb-2 overflow-hidden">
                      <Shimmer />
                    </div>
                    <div className="relative h-4 w-20 bg-gradient-to-r from-grey-200 via-grey-100 to-grey-200 rounded overflow-hidden">
                      <Shimmer />
                    </div>
                  </div>
                </div>
                
                <Shimmer />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EarningsPageSkeleton;

