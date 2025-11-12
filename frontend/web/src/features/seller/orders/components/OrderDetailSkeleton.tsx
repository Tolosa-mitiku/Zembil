import Shimmer from '@/shared/components/Shimmer';

const OrderDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFBF5] via-grey-50 to-grey-100">
      {/* Sticky Header Skeleton */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-grey-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side */}
            <div className="flex items-center space-x-6">
              <Shimmer className="h-9 w-20 rounded-lg" />
              <div className="flex items-center space-x-2">
                <Shimmer className="h-4 w-12 rounded" />
                <Shimmer className="h-4 w-4 rounded" />
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-4 w-4 rounded" />
                <Shimmer className="h-4 w-32 rounded" />
              </div>
            </div>

            {/* Center */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right space-y-2">
                <Shimmer className="h-6 w-48 rounded ml-auto" />
                <Shimmer className="h-3 w-24 rounded ml-auto" />
              </div>
              <Shimmer className="h-8 w-24 rounded-full" />
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <Shimmer className="h-10 w-40 rounded-xl" />
              <Shimmer className="h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (65%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline Skeleton */}
            <div className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden">
              <div className="px-8 py-6 border-b border-grey-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Shimmer className="h-6 w-32 rounded" />
                    <Shimmer className="h-4 w-48 rounded" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Shimmer className="h-4 w-32 rounded ml-auto" />
                    <Shimmer className="h-5 w-24 rounded ml-auto" />
                  </div>
                </div>
              </div>
              <div className="p-8">
                {/* Timeline Steps */}
                <div className="hidden md:block">
                  <div className="relative">
                    <Shimmer className="absolute top-10 left-0 right-0 h-1 rounded-full" />
                    <div className="relative grid grid-cols-6 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Shimmer className="w-20 h-20 rounded-full mb-4" />
                          <Shimmer className="h-4 w-20 rounded mb-1" />
                          <Shimmer className="h-3 w-16 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section Skeleton */}
            <div className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden">
              <div className="px-8 py-6 border-b border-grey-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shimmer className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Shimmer className="h-5 w-40 rounded" />
                      <Shimmer className="h-4 w-24 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Shimmer className="h-4 w-20 rounded ml-auto" />
                    <Shimmer className="h-6 w-12 rounded ml-auto" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-grey-50 rounded-xl p-4 border border-grey-200">
                      <div className="flex gap-4">
                        <Shimmer className="w-28 h-28 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-3">
                          <Shimmer className="h-4 w-full rounded" />
                          <Shimmer className="h-3 w-24 rounded" />
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Shimmer className="h-3 w-16 rounded" />
                              <Shimmer className="h-3 w-12 rounded" />
                            </div>
                            <div className="flex justify-between">
                              <Shimmer className="h-3 w-16 rounded" />
                              <Shimmer className="h-3 w-8 rounded" />
                            </div>
                            <div className="flex justify-between pt-2 border-t">
                              <Shimmer className="h-4 w-16 rounded" />
                              <Shimmer className="h-5 w-20 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Shimmer className="h-32 rounded-xl" />
              </div>
            </div>

            {/* Additional Sections */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-grey-200 shadow-lg p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Shimmer className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                      <Shimmer className="h-5 w-40 rounded" />
                      <Shimmer className="h-4 w-56 rounded" />
                    </div>
                  </div>
                  <Shimmer className="h-24 rounded-xl" />
                  <Shimmer className="h-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar - Sticky Cards (35%) */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Order Summary Card Skeleton */}
              <div className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-br from-gold/10 via-amber-50 to-orange-50 border-b border-grey-200">
                  <Shimmer className="h-5 w-32 rounded mb-4" />
                  <div className="space-y-3">
                    <Shimmer className="h-4 w-24 rounded" />
                    <Shimmer className="h-8 w-48 rounded" />
                  </div>
                  <div className="flex justify-center my-4">
                    <Shimmer className="w-32 h-32 rounded-full" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Shimmer key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              </div>

              {/* Customer Info Card Skeleton */}
              <div className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-grey-200">
                  <Shimmer className="h-5 w-40 rounded mb-4" />
                  <div className="flex items-center gap-4 mb-4">
                    <Shimmer className="w-16 h-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Shimmer className="h-5 w-32 rounded" />
                      <Shimmer className="h-4 w-20 rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <Shimmer className="h-3 w-24 rounded" />
                      <Shimmer className="h-10 rounded-lg" />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <Shimmer className="h-12 rounded-xl" />
                    <Shimmer className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-t">
                  <Shimmer className="h-4 w-32 rounded mb-3" />
                  <Shimmer className="h-16 rounded mb-3" />
                  <Shimmer className="h-10 rounded-lg" />
                </div>
              </div>

              {/* Quick Actions Card Skeleton */}
              <div className="bg-white rounded-2xl border border-grey-200 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-grey-200">
                  <Shimmer className="h-5 w-32 rounded mb-1" />
                  <Shimmer className="h-3 w-24 rounded" />
                </div>
                <div className="p-6 space-y-3">
                  <Shimmer className="h-12 rounded-xl" />
                  <Shimmer className="h-10 rounded-xl" />
                  <Shimmer className="h-10 rounded-xl" />
                  <Shimmer className="h-10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;

