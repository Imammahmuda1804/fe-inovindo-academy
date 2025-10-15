'use client';

const MateriSkeleton = () => {
  return (
    <div className="text-gray-800 flex flex-col font-['Inter'] pt-24 h-screen animate-pulse">
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="hidden lg:block lg:w-1/3 flex-shrink-0 overflow-y-auto p-8 pt-0">
          <div className="h-10 w-2/3 bg-gray-300 rounded-lg mb-4 mt-8"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="pt-2 border-t border-gray-200">
                <div className="h-8 w-full bg-gray-200 rounded-md mb-2"></div>
                <div className="pl-3 mt-1 space-y-2">
                  <div className="h-8 w-5/6 bg-gray-200 rounded-lg"></div>
                  <div className="h-8 w-5/6 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 w-full overflow-y-auto">
          <div>
            <div className="px-4 pt-4 sm:px-6 md:px-8 lg:px-16 lg:pt-8">
              <div className="h-8 w-1/4 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-10 w-3/4 bg-gray-300 rounded-lg mb-2"></div>
            </div>

            <div className="mb-6 aspect-video lg:rounded-2xl lg:overflow-hidden lg:mx-16 bg-gray-300"></div>

            <div className="px-4 sm:px-6 md:px-8 lg:px-16">
              <div className="p-8 mt-8 bg-gray-200 rounded-2xl">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                </div>
                <div className="h-6 w-1/3 bg-gray-300 rounded-lg mt-8 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 w-full bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>

              <div className="p-8 mt-8 bg-gray-200 rounded-2xl">
                <div className="h-8 w-1/2 bg-gray-300 rounded-lg mb-6 mx-auto"></div>
                <div className="h-12 w-1/3 bg-gray-300 rounded-lg mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MateriSkeleton;
