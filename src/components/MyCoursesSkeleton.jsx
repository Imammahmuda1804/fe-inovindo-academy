'use client';

const CardSkeleton = () => (
  <div className="bg-white shadow-lg border border-gray-200/80 rounded-2xl overflow-hidden">
    <div className="h-40 bg-gray-200 animate-pulse"></div>
    <div className="p-5">
      <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="flex items-center my-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse mb-1"></div>
      <div className="h-2 w-1/4 bg-gray-200 rounded-full animate-pulse"></div>
    </div>
  </div>
);

const MyCoursesSkeleton = () => {
  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
      <main className="container mx-auto py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-72">
            <div className="sticky top-48 p-4 bg-white rounded-2xl shadow-lg border border-gray-200/80">
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Header Skeleton */}
            <div className="mb-12 text-center">
              <div className="h-12 w-1/2 bg-gray-300 rounded-lg mx-auto animate-pulse"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse"></div>
            </div>

            {/* Search/Filter Skeleton */}
            <div className="mb-8 p-4 bg-white/60 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-11 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards Grid Skeleton */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyCoursesSkeleton;
