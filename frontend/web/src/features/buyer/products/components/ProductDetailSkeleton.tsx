const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse" />

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-gray-100 rounded-xl">
                  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-20" />
              </div>
              
              <div className="h-10 bg-gray-200 rounded animate-pulse w-full mb-2" />
              <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4" />

              {/* Rating */}
              <div className="flex items-center gap-4 mt-4">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-48" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              </div>
            </div>

            {/* Price Section */}
            <div className="p-5 rounded-2xl bg-gray-100 border-2 border-gray-200">
              <div className="flex items-end gap-4 mb-3">
                <div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mb-2" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse w-32" />
                </div>
                <div className="pb-1">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-1" />
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>

              <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-full" />
            </div>

            {/* Quantity & Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse w-32" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
                <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
              </div>

              <div className="h-11 bg-gray-200 rounded-xl animate-pulse w-full" />
            </div>

            {/* Seller Info */}
            <div className="p-4 rounded-2xl bg-gray-100 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-1" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  </div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
            </div>

            {/* Key Features */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32 mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mt-16">
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse w-24 mb-4" />
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-20">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2" />
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;

