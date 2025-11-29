import Shimmer from '@/shared/components/Shimmer';

const OrderCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-grey-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-5 py-4 bg-grey-50 border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Shimmer className="h-5 w-40 rounded" />
              <Shimmer className="h-3 w-32 rounded" />
            </div>
          </div>
          <Shimmer className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Product Items */}
          <div className="lg:col-span-5">
            <Shimmer className="h-4 w-32 rounded mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Shimmer className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-4 w-full rounded" />
                    <Shimmer className="h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="lg:col-span-4">
            <Shimmer className="h-4 w-32 rounded mb-3" />
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Shimmer className="w-4 h-4 rounded mt-0.5" />
                <div className="flex-1 space-y-2">
                  <Shimmer className="h-4 w-full rounded" />
                  <Shimmer className="h-3 w-24 rounded" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Shimmer className="w-4 h-4 rounded mt-0.5" />
                <Shimmer className="h-4 w-full rounded" />
              </div>
              <div className="flex items-start gap-2">
                <Shimmer className="w-4 h-4 rounded mt-0.5" />
                <Shimmer className="h-4 w-32 rounded" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-3">
            <Shimmer className="h-4 w-32 rounded mb-3" />
            <div className="space-y-2">
              <div className="flex justify-between">
                <Shimmer className="h-4 w-16 rounded" />
                <Shimmer className="h-4 w-20 rounded" />
              </div>
              <div className="pt-2 border-t border-grey-200">
                <div className="flex justify-between items-center">
                  <Shimmer className="h-5 w-12 rounded" />
                  <Shimmer className="h-6 w-24 rounded" />
                </div>
              </div>
              <div className="pt-2">
                <Shimmer className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 pt-5 border-t border-grey-200">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <Shimmer className="w-8 h-8 rounded-full" />
                {i < 5 && <Shimmer className="flex-1 h-1 rounded" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-4 bg-grey-50 border-t border-grey-200">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shimmer className="h-9 w-32 rounded-lg" />
            <Shimmer className="h-9 w-24 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-9 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCardSkeleton;

