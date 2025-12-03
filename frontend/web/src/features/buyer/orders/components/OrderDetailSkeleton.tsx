/**
 * Order Detail Page Skeleton
 * Shimmer loading state that matches the order detail page design
 */

import { motion } from 'framer-motion';

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`;

const OrderDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <div className={`w-9 h-9 rounded-lg bg-gray-200 ${shimmer}`} />
              <div>
                {/* Order Number */}
                <div className={`h-5 w-32 bg-gray-200 rounded-md mb-1.5 ${shimmer}`} />
                {/* Date */}
                <div className={`h-3 w-24 bg-gray-100 rounded-md ${shimmer}`} />
              </div>
            </div>
            {/* Print Button */}
            <div className={`w-9 h-9 rounded-lg bg-gray-100 ${shimmer}`} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 overflow-hidden relative"
            >
              {/* Gradient Top Bar */}
              <div className={`absolute top-0 left-0 right-0 h-2 bg-gray-200 ${shimmer}`} />

              {/* Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gray-200 ${shimmer}`} />
                <div className={`h-6 w-36 bg-gray-200 rounded-md ${shimmer}`} />
              </div>

              {/* Timeline Steps */}
              <div className="relative space-y-6">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative flex gap-6 pb-4">
                    {/* Timeline Line */}
                    {index < 3 && (
                      <div className="absolute left-6 top-14 w-0.5 h-full -translate-x-1/2">
                        <div className={`h-full w-full bg-gray-200 ${shimmer}`} />
                      </div>
                    )}

                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 ${shimmer}`} />

                    {/* Status Info */}
                    <div className="flex-1 pt-2">
                      <div className={`h-4 w-24 bg-gray-200 rounded-md mb-2 ${shimmer}`} />
                      <div className={`h-3 w-36 bg-gray-100 rounded-md ${shimmer}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking Number Box */}
              <div className={`mt-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl ${shimmer}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`h-3 w-24 bg-gray-200 rounded-md mb-2 ${shimmer}`} />
                    <div className={`h-4 w-32 bg-gray-300 rounded-md ${shimmer}`} />
                  </div>
                  <div className={`h-9 w-28 bg-gray-300 rounded-lg ${shimmer}`} />
                </div>
              </div>
            </motion.div>

            {/* Order Items Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
            >
              {/* Title */}
              <div className={`h-6 w-28 bg-gray-200 rounded-md mb-6 ${shimmer}`} />

              {/* Items */}
              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl bg-gray-50">
                    {/* Product Image */}
                    <div className={`w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 ${shimmer}`} />

                    <div className="flex-1">
                      {/* Product Name */}
                      <div className={`h-4 w-3/4 bg-gray-200 rounded-md mb-2 ${shimmer}`} />
                      {/* Seller & Variant */}
                      <div className={`h-3 w-1/2 bg-gray-100 rounded-md mb-3 ${shimmer}`} />
                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div className={`h-3 w-16 bg-gray-100 rounded-md ${shimmer}`} />
                        <div className={`h-4 w-20 bg-gray-200 rounded-md ${shimmer}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Seller Button */}
              <div className="mt-6 pt-6 border-t-2 border-gray-100">
                <div className={`h-11 w-full bg-gray-200 rounded-xl ${shimmer}`} />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary Card Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 bg-gray-50 border-b-2 border-gray-200">
                <div className={`h-5 w-32 bg-gray-200 rounded-md ${shimmer}`} />
              </div>

              {/* Summary Items */}
              <div className="p-6 space-y-3">
                {['Subtotal', 'Shipping', 'Tax'].map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <div className={`h-3 w-16 bg-gray-100 rounded-md ${shimmer}`} />
                    <div className={`h-3 w-14 bg-gray-200 rounded-md ${shimmer}`} />
                  </div>
                ))}

                {/* Total */}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-baseline">
                    <div className={`h-4 w-12 bg-gray-200 rounded-md ${shimmer}`} />
                    <div className={`h-7 w-24 bg-gray-300 rounded-md ${shimmer}`} />
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 bg-gray-200 rounded ${shimmer}`} />
                  <div>
                    <div className={`h-3 w-24 bg-gray-100 rounded-md mb-1.5 ${shimmer}`} />
                    <div className={`h-4 w-20 bg-gray-200 rounded-md mb-1 ${shimmer}`} />
                    <div className={`h-3 w-16 bg-gray-100 rounded-md ${shimmer}`} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-5 shadow-xl border border-gray-200"
            >
              {/* Title */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-4 h-4 bg-gray-200 rounded ${shimmer}`} />
                <div className={`h-4 w-32 bg-gray-200 rounded-md ${shimmer}`} />
              </div>

              {/* Address Lines */}
              <div className="space-y-2">
                <div className={`h-4 w-36 bg-gray-200 rounded-md ${shimmer}`} />
                <div className={`h-3 w-full bg-gray-100 rounded-md ${shimmer}`} />
                <div className={`h-3 w-3/4 bg-gray-100 rounded-md ${shimmer}`} />
                <div className={`h-3 w-1/2 bg-gray-100 rounded-md ${shimmer}`} />
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <div className={`h-3 w-28 bg-gray-100 rounded-md ${shimmer}`} />
                </div>
              </div>
            </motion.div>

            {/* Estimated Delivery Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-200 rounded-3xl p-5 shadow-xl overflow-hidden"
            >
              <div className={`h-full w-full ${shimmer}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gray-300 rounded" />
                  <div className="h-4 w-36 bg-gray-300 rounded-md" />
                </div>
                <div className="h-8 w-24 bg-gray-300 rounded-md mb-1" />
                <div className="h-3 w-20 bg-gray-300/70 rounded-md" />
              </div>
            </motion.div>

            {/* Quick Actions Skeleton */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-5 shadow-xl border border-gray-200"
            >
              <div className={`h-4 w-24 bg-gray-200 rounded-md mb-3 ${shimmer}`} />
              <div className="flex gap-2">
                <div className={`flex-1 h-9 bg-gray-100 rounded-lg ${shimmer}`} />
                <div className={`flex-1 h-9 bg-gray-100 rounded-lg ${shimmer}`} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;

