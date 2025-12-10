/**
 * Orders Page Skeleton
 * Shimmer loading state that matches the orders page design
 */

import { motion } from 'framer-motion';

const shimmer = `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent`;

const OrderCardSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200"
  >
    {/* Gradient Top Bar Skeleton */}
    <div className={`h-2 bg-gray-200 ${shimmer}`} />

    <div className="p-6">
      {/* Order Header Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div className={`w-12 h-12 rounded-xl bg-gray-200 ${shimmer}`} />
          <div>
            {/* Order Number */}
            <div className={`h-4 w-28 bg-gray-200 rounded-md mb-2 ${shimmer}`} />
            {/* Date */}
            <div className={`h-3 w-20 bg-gray-100 rounded-md ${shimmer}`} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className={`h-8 w-24 bg-gray-200 rounded-full ${shimmer}`} />
          {/* Arrow */}
          <div className={`w-5 h-5 bg-gray-100 rounded ${shimmer}`} />
        </div>
      </div>

      {/* Order Items Skeleton */}
      <div className="space-y-3 mb-6">
        {[0, 1].map((itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
            {/* Product Image */}
            <div className={`w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 ${shimmer}`} />
            <div className="flex-1 min-w-0">
              {/* Product Name */}
              <div className={`h-4 w-3/4 bg-gray-200 rounded-md mb-2 ${shimmer}`} />
              {/* Quantity & Price */}
              <div className={`h-3 w-1/2 bg-gray-100 rounded-md mb-1 ${shimmer}`} />
              {/* Seller */}
              <div className={`h-3 w-1/3 bg-gray-100 rounded-md ${shimmer}`} />
            </div>
            {/* Item Total */}
            <div className={`h-5 w-16 bg-gray-200 rounded-md ${shimmer}`} />
          </div>
        ))}
      </div>

      {/* Order Footer Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-gray-100">
        <div className="flex items-center gap-4">
          {/* Tracking Badge */}
          <div className={`h-8 w-32 bg-gray-100 rounded-lg ${shimmer}`} />
          {/* Estimated Delivery */}
          <div className={`h-8 w-28 bg-gray-100 rounded-lg ${shimmer}`} />
        </div>

        <div className="text-right">
          {/* Total Label */}
          <div className={`h-3 w-16 bg-gray-100 rounded-md mb-2 ml-auto ${shimmer}`} />
          {/* Total Amount */}
          <div className={`h-8 w-24 bg-gray-200 rounded-md ${shimmer}`} />
        </div>
      </div>
    </div>
  </motion.div>
);

const OrdersSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Skeleton Order Cards */}
      {[0, 1, 2].map((index) => (
        <OrderCardSkeleton key={index} index={index} />
      ))}
    </div>
  );
};

export default OrdersSkeleton;

