/**
 * Profile Page Skeleton
 * Loading skeleton for the buyer profile page
 */

const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-20 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="relative h-80 bg-gray-200" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Skeleton */}
        <div className="relative -mt-24 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            {/* Avatar Skeleton */}
            <div className="w-40 h-40 rounded-3xl bg-gray-300 border-4 border-white shadow-2xl" />

            {/* User Info Skeleton */}
            <div className="flex-1 text-center md:text-left">
              <div className="space-y-3">
                <div className="h-10 bg-gray-300 rounded-lg w-64 mx-auto md:mx-0" />
                <div className="h-6 bg-gray-200 rounded w-48 mx-auto md:mx-0" />
                
                {/* Quick Stats Skeleton */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4">
                  <div className="h-5 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-28" />
                </div>
              </div>
            </div>

            {/* Edit Button Skeleton */}
            <div className="h-12 bg-gray-300 rounded-xl w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Skeleton - Stats & Achievements */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="space-y-4">
              <div className="bg-gray-300 rounded-3xl h-32" />
              <div className="bg-gray-300 rounded-3xl h-32" />
              <div className="bg-gray-300 rounded-3xl h-32" />
            </div>

            {/* Achievements Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="bg-gray-200 rounded-2xl h-24" />
                ))}
              </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="h-12 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column Skeleton - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Skeleton */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="h-8 bg-gray-300 rounded w-48 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="h-4 bg-gray-300 rounded w-20 mb-2" />
                    <div className="h-6 bg-gray-200 rounded w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders Skeleton */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-gray-300 rounded w-40" />
                <div className="h-6 bg-gray-200 rounded w-20" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-48 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-5 bg-gray-300 rounded w-16 ml-auto" />
                      <div className="h-5 bg-gray-200 rounded w-20 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Categories Skeleton */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <div className="h-6 bg-gray-300 rounded w-40 mb-4" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="h-10 bg-gray-200 rounded-full w-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;

