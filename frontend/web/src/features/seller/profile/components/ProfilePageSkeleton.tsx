const ProfilePageSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg animate-pulse">
              <div className="w-6 h-6 bg-white/30 rounded"></div>
            </div>
            <div>
              <div className="h-8 w-48 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg mb-2 animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-4 w-64 bg-gradient-to-r from-grey-200 to-grey-300 rounded animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.1s' }}></div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - Main Content Skeleton */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            
            {/* Personal Information Card Skeleton */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg animate-pulse">
                    <div className="w-5 h-5 bg-white/30 rounded"></div>
                  </div>
                  <div className="h-6 w-48 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="h-4 w-24 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <div className="md:col-span-2">
                  <div className="h-4 w-32 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-3 w-48 bg-gradient-to-r from-grey-200 to-grey-300 rounded mt-2 animate-shimmer bg-[length:200%_100%]"></div>
                </div>
                <div className="md:col-span-2">
                  <div className="h-4 w-28 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>

            {/* Business Information Card Skeleton */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg animate-pulse">
                  <div className="w-5 h-5 bg-white/30 rounded"></div>
                </div>
                <div className="h-6 w-52 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <div className="h-4 w-32 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <div className="md:col-span-2">
                  <div className="h-4 w-36 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="md:col-span-2">
                  <div className="h-4 w-44 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-32 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.3s' }}></div>
                  <div className="h-3 w-32 bg-gradient-to-r from-grey-200 to-grey-300 rounded mt-2 ml-auto animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            </div>

            {/* Account Statistics Card Skeleton */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg shadow-lg animate-pulse">
                  <div className="w-5 h-5 bg-white/30 rounded"></div>
                </div>
                <div className="h-6 w-40 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-grey-100 to-grey-200 p-4 border border-grey-200 animate-pulse">
                    <div className="h-4 w-32 bg-gradient-to-r from-grey-300 to-grey-400 rounded mb-2 animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${index * 0.1}s` }}></div>
                    <div className="h-6 w-24 bg-gradient-to-r from-grey-300 to-grey-400 rounded animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Media Sidebar Skeleton */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="sticky top-24 space-y-6">
              {/* Main Media Card Skeleton */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                
                {/* Cover Photo Skeleton */}
                <div className="relative w-full h-48 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
                </div>

                {/* Avatar Skeleton */}
                <div className="absolute top-32 left-6">
                  <div className="relative w-32 h-32 rounded-2xl border-4 border-white bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 shadow-2xl animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer bg-[length:200%_100%]"></div>
                  </div>
                </div>

                {/* Profile Info Skeleton */}
                <div className="px-6 pt-20 pb-6">
                  <div className="mb-6">
                    <div className="h-8 w-40 bg-gradient-to-r from-grey-200 to-grey-300 rounded-lg mb-2 animate-shimmer bg-[length:200%_100%]"></div>
                    <div className="h-5 w-48 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-2 animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-4 w-36 bg-gradient-to-r from-grey-200 to-grey-300 rounded mb-4 animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-10 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg animate-pulse"></div>
                  </div>

                  <div className="h-12 bg-gradient-to-r from-grey-200 to-grey-300 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>

              {/* Quick Stats Card Skeleton */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg animate-pulse">
                    <div className="w-4 h-4 bg-white/30 rounded"></div>
                  </div>
                  <div className="h-4 w-24 bg-gradient-to-r from-grey-200 to-grey-300 rounded animate-shimmer bg-[length:200%_100%]"></div>
                </div>
                
                <div className="space-y-3">
                  {/* Profile Completion Bar */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-3 border border-green-200 animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-3 w-32 bg-gradient-to-r from-grey-300 to-grey-400 rounded animate-shimmer bg-[length:200%_100%]"></div>
                      <div className="h-4 w-12 bg-gradient-to-r from-grey-300 to-grey-400 rounded animate-shimmer bg-[length:200%_100%]"></div>
                    </div>
                    <div className="h-2 bg-grey-200 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-grey-100 to-grey-200 p-3 border border-grey-200 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="h-3 w-24 bg-gradient-to-r from-grey-300 to-grey-400 rounded animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${index * 0.1}s` }}></div>
                        <div className="h-6 w-16 bg-gradient-to-r from-grey-300 to-grey-400 rounded animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${index * 0.1 + 0.05}s` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageSkeleton;















