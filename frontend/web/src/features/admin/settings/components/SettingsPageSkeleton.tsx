const SettingsPageSkeleton = () => {
  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-grey-200 via-grey-300 to-grey-200 p-8 md:p-12 shadow-xl h-48">
        <div className="absolute inset-0 shimmer-bg" />
        <div className="relative z-10 flex items-center gap-6">
          {/* Icon Skeleton */}
          <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-2xl bg-white/30 backdrop-blur-lg relative overflow-hidden">
            <div className="absolute inset-0 shimmer-overlay" />
          </div>

          {/* Text Content Skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-white/40 rounded w-48 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
            <div className="h-8 bg-white/50 rounded w-64 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
            <div className="h-5 bg-white/40 rounded w-96 max-w-full relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 bg-grey-200 rounded w-24 relative overflow-hidden">
          <div className="absolute inset-0 shimmer-overlay" />
        </div>
        <div className="w-4 h-4 bg-grey-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 shimmer-overlay" />
        </div>
        <div className="h-4 bg-grey-200 rounded w-20 relative overflow-hidden">
          <div className="absolute inset-0 shimmer-overlay" />
        </div>
      </div>

      {/* Settings Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border-2 border-grey-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Icon Skeleton */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-grey-200 to-grey-300 relative overflow-hidden">
                <div className="absolute inset-0 shimmer-overlay" />
              </div>

              {/* Title Skeleton */}
              <div className="space-y-2">
                <div className="h-5 bg-grey-200 rounded w-3/4 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer-overlay" />
                </div>
                {/* Description Skeleton */}
                <div className="space-y-1.5">
                  <div className="h-3 bg-grey-200 rounded w-full relative overflow-hidden">
                    <div className="absolute inset-0 shimmer-overlay" />
                  </div>
                  <div className="h-3 bg-grey-200 rounded w-5/6 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer-overlay" />
                  </div>
                </div>
              </div>

              {/* Arrow Indicator Skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-3 bg-grey-200 rounded w-20 relative overflow-hidden">
                  <div className="absolute inset-0 shimmer-overlay" />
                </div>
                <div className="w-4 h-4 bg-grey-200 rounded relative overflow-hidden">
                  <div className="absolute inset-0 shimmer-overlay" />
                </div>
              </div>
            </div>

            {/* Bottom Border Skeleton */}
            <div className="h-1 bg-gradient-to-r from-grey-200 via-grey-300 to-grey-200 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-gradient-to-br from-gold-pale/50 to-white border-2 border-grey-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-grey-200 rounded w-32 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
            <div className="h-3 bg-grey-200 rounded w-48 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-grey-200 rounded-lg w-32 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
            <div className="h-10 bg-grey-200 rounded-lg w-40 relative overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay" />
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles for Shimmer Effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .shimmer-bg {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 100%
            );
            animation: shimmer 2s infinite;
          }

          .shimmer-overlay {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            animation: shimmer 2s infinite;
          }
        `
      }} />
    </div>
  );
};

export default SettingsPageSkeleton;
















