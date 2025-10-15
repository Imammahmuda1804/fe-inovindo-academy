'use client';

const SkeletonCard = () => (
  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden">
    <div className="px-6 py-5 border-b border-gray-200">
      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    </div>
  </div>
);

const SettingsSkeleton = () => {
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
          <div className="flex-1 space-y-8">
            {/* Header Skeleton */}
            <div className="mb-12 text-center">
              <div className="h-12 w-1/2 bg-gray-300 rounded-lg mx-auto animate-pulse"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded-lg mx-auto mt-4 animate-pulse"></div>
            </div>
            
            {/* Tabs Skeleton */}
            <div className="flex space-x-2 border-b-2 border-gray-200 mb-8">
                <div className="h-10 w-24 bg-gray-300 rounded-t-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-t-lg animate-pulse"></div>
            </div>

            <SkeletonCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsSkeleton;
