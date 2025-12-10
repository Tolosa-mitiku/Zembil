const SearchPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header Skeleton */}
        <div className="mb-8">
          {/* Title */}
          <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-72 mb-6 animate-shimmer bg-[length:200%_100%]" />

          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 h-14 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]" />
            <div className="w-24 md:w-32 h-14 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]" />
          </div>

          {/* Results Count & Sort */}
          <div className="mt-4 flex items-center justify-between">
            <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-48 animate-shimmer bg-[length:200%_100%]" />
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg w-40 animate-shimmer bg-[length:200%_100%]" />
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg overflow-hidden border border-gray-200"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Image Skeleton */}
              <div className="aspect-[3/4] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] relative">
                <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300/50 rounded-md" />
              </div>
              
              {/* Info Skeleton */}
              <div className="p-4 space-y-2">
                {/* Category */}
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20" />
                
                {/* Rating */}
                <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-24" />
                
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-full" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-3/4" />
                </div>
                
                {/* Price */}
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] w-20 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPageSkeleton;
