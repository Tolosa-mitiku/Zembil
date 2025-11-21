const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-grey-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-gradient-to-r from-grey-100 via-grey-200 to-grey-100 bg-[length:200%_100%] animate-shimmer" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category & Status */}
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 bg-grey-200 rounded" />
          <div className="h-5 w-16 bg-grey-200 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-grey-200 rounded" />
          <div className="h-4 w-3/4 bg-grey-200 rounded" />
        </div>

        {/* Rating */}
        <div className="h-3 w-24 bg-grey-200 rounded" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 bg-grey-200 rounded" />
          <div className="h-4 w-16 bg-grey-200 rounded" />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-grey-100">
          <div className="flex items-center gap-3">
            <div className="h-3 w-16 bg-grey-200 rounded" />
            <div className="h-3 w-16 bg-grey-200 rounded" />
          </div>
          <div className="h-5 w-16 bg-grey-200 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

