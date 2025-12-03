interface HomePageSkeletonProps {
  isAuthenticated?: boolean;
}

const HomePageSkeleton = ({ isAuthenticated = false }: HomePageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Skeleton - Only show for unauthenticated users */}
      {!isAuthenticated && (
        <div className="relative h-[650px] md:h-[700px] w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%]" />
      )}

      {/* Trust Badges Skeleton - Only show for unauthenticated users */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] mb-4" />
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-2 w-3/4" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-1/2" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Carousel Skeleton */}
      <section className={`py-8 bg-gradient-to-br from-gray-50 to-white ${isAuthenticated ? 'pt-4' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-48" />
            <div className="h-9 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]" />
          </div>
          
          {/* Carousel Cards */}
          <div className="flex gap-6 overflow-hidden pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shrink-0 w-[400px]">
                <div className="relative bg-gray-900 rounded-3xl h-[320px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer bg-[length:200%_100%]" />
                  
                  {/* Card content shimmer */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top badges */}
                    <div className="flex justify-between">
                      <div className="space-y-1.5">
                        <div className="h-5 w-16 bg-white/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
                    </div>
                    
                    {/* Bottom content */}
                    <div className="space-y-2">
                      <div className="h-3 w-16 bg-white/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
                      <div className="h-4 w-48 bg-white/30 rounded animate-shimmer bg-[length:200%_100%]" />
                      <div className="flex justify-between items-center">
                        <div className="h-5 w-20 bg-white/30 rounded animate-shimmer bg-[length:200%_100%]" />
                        <div className="flex gap-2">
                          <div className="w-10 h-10 bg-white/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
                          <div className="w-10 h-10 bg-white/20 rounded-full animate-shimmer bg-[length:200%_100%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel dots */}
          <div className="flex justify-center gap-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-2 rounded-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%] ${i === 1 ? 'w-8' : 'w-2'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Skeleton */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-xl border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16" />
          </div>
          
          {/* Category pills */}
          <div className="flex gap-2 overflow-hidden pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-9 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
              {/* Image Shimmer */}
              <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] relative">
                <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300/50 rounded-md" />
              </div>
              
              {/* Content Shimmer */}
              <div className="p-4 space-y-1.5">
                {/* Category */}
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
                
                {/* Rating */}
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-24 animate-shimmer bg-[length:200%_100%]" />
                
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full animate-shimmer bg-[length:200%_100%]" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-shimmer bg-[length:200%_100%]" />
                </div>
                
                {/* Price */}
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20 animate-shimmer bg-[length:200%_100%] mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full blur-3xl animate-shimmer bg-[length:200%_100%]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-full blur-3xl animate-shimmer bg-[length:200%_100%]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="h-10 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-80 mx-auto mb-4" />
          <div className="h-5 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-56 mx-auto mb-10" />
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1 h-14 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl animate-shimmer bg-[length:200%_100%]" />
            <div className="h-14 w-40 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded-2xl animate-shimmer bg-[length:200%_100%]" />
          </div>
          <div className="h-3 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded animate-shimmer bg-[length:200%_100%] w-40 mx-auto mt-4" />
        </div>
      </section>

      {/* Footer Promo Skeleton */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20 mx-auto mb-2" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;
