import { motion } from 'framer-motion';

const HomePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Skeleton */}
      <div className="relative h-[650px] md:h-[700px] w-full bg-gray-200 animate-pulse" />

      {/* Trust Badges Skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse mb-4" />
              <div className="h-5 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel Skeleton */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-80 mb-2" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-48" />
            </div>
            <div className="hidden md:block h-12 w-32 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          
          <div className="flex gap-6 overflow-hidden">
            {[1, 2].map((i) => (
              <div key={i} className="shrink-0 w-[500px]">
                <div className="relative bg-gray-200 rounded-3xl h-[400px] animate-pulse" />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Skeleton */}
      <div className="sticky top-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-40" />
            <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-2 overflow-hidden">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-200 rounded-full animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-5 bg-gray-200 rounded animate-pulse w-full" />
                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Skeleton */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="h-12 bg-gray-700 rounded animate-pulse w-96 mx-auto mb-4" />
          <div className="h-6 bg-gray-700 rounded animate-pulse w-64 mx-auto mb-10" />
          <div className="flex gap-4 max-w-xl mx-auto">
            <div className="flex-1 h-14 bg-gray-700 rounded-2xl animate-pulse" />
            <div className="h-14 w-40 bg-gray-700 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Footer Stats Skeleton */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-12 bg-gray-200 rounded animate-pulse w-24 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageSkeleton;


