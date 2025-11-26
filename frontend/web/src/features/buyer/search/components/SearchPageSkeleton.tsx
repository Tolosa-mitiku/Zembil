const SearchPageSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          {/* Image Skeleton */}
          <div className="aspect-[3/4] bg-gray-200 animate-pulse relative">
            <div className="absolute top-3 right-3 w-12 h-6 bg-gray-300 rounded-md animate-pulse" />
          </div>
          
          {/* Info Skeleton */}
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-14" />
              </div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
            </div>
            <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPageSkeleton;


