import { motion } from 'framer-motion';

const ProductEditSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 via-white to-gold/5">
      {/* Fixed Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-grey-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-grey-200 animate-pulse" />
              <div>
                <div className="h-8 w-48 bg-grey-200 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Middle: Auto-save indicator placeholder */}
            <div className="hidden md:flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-grey-200 animate-pulse" />
              <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-grey-200 rounded-xl animate-pulse" />
              <div className="h-10 w-32 bg-gold/20 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Image Gallery + Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Upload Zone */}
            <div className="min-h-[280px] rounded-2xl border-2 border-dashed border-grey-300 bg-grey-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-grey-200 animate-pulse" />
                <div className="h-6 w-40 mx-auto bg-grey-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 mx-auto bg-grey-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Section Navigation */}
            <div className="hidden lg:block space-y-2">
              <div className="mb-3 px-3">
                <div className="h-4 w-20 bg-grey-200 rounded animate-pulse" />
              </div>
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-grey-100">
                  <div className="w-1 h-6 rounded-full bg-grey-200 animate-pulse" />
                  <div className="w-8 h-8 rounded-lg bg-grey-200 animate-pulse" />
                  <div className="h-4 flex-1 bg-grey-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Form Sections */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Section 1: Basic Information */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 animate-pulse" />
                <div>
                  <div className="h-6 w-48 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-5">
                {/* Product Title */}
                <div>
                  <div className="h-4 w-32 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                </div>

                {/* Description */}
                <div>
                  <div className="h-4 w-24 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-48 w-full bg-grey-200 rounded-xl animate-pulse" />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 w-20 bg-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-16 bg-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                  </div>
                </div>

                {/* SKU */}
                <div>
                  <div className="h-4 w-40 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 animate-pulse" />
                <div>
                  <div className="h-6 w-40 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="h-4 w-16 bg-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 w-32 bg-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Inventory */}
            <div className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 animate-pulse" />
                <div>
                  <div className="h-6 w-36 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-28 bg-grey-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="h-4 w-32 bg-grey-200 rounded animate-pulse mb-2" />
                  <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>

            {/* More sections placeholders */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border-2 border-grey-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-grey-200 animate-pulse" />
                  <div>
                    <div className="h-6 w-40 bg-grey-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-32 bg-grey-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-grey-200 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .animate-pulse {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            to right,
            #f0f0f0 0%,
            #f8f8f8 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>
    </div>
  );
};

export default ProductEditSkeleton;

