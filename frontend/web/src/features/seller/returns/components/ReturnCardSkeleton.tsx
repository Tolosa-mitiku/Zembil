const ReturnCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-grey-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-5 py-4 bg-grey-50 border-b border-grey-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-grey-200" />
            <div>
              <div className="h-5 w-32 bg-grey-200 rounded mb-2" />
              <div className="h-3 w-24 bg-grey-200 rounded" />
            </div>
          </div>
          <div className="h-8 w-24 bg-grey-200 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Product */}
          <div className="lg:col-span-5">
            <div className="h-4 w-32 bg-grey-200 rounded mb-3" />
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-grey-200" />
              <div className="flex-1">
                <div className="h-4 w-full bg-grey-200 rounded mb-2" />
                <div className="h-3 w-24 bg-grey-200 rounded" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-4">
            <div className="h-4 w-32 bg-grey-200 rounded mb-3" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-grey-200 rounded" />
              <div className="h-16 bg-grey-200 rounded" />
              <div className="h-12 bg-grey-200 rounded" />
            </div>
          </div>

          {/* Amount */}
          <div className="lg:col-span-3">
            <div className="h-4 w-32 bg-grey-200 rounded mb-3" />
            <div className="h-24 bg-grey-200 rounded" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-grey-50 border-t border-grey-200">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-grey-200 rounded" />
          <div className="flex gap-2">
            <div className="h-8 w-28 bg-grey-200 rounded" />
            <div className="h-8 w-20 bg-grey-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnCardSkeleton;













