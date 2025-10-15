'use client';

const DetailCourseSkeleton = () => {
  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16 animate-pulse">
      <main className="container mx-auto py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content Skeleton */}
          <div className="w-full lg:w-2/3">
            {/* Header Skeleton */}
            <div className="mb-12 text-center">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-12 w-3/4 bg-gray-300 rounded-lg mx-auto my-4"></div>
              <div className="inline-flex items-center gap-4 mt-6">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Video Skeleton */}
            <div className="mb-8 rounded-2xl shadow-2xl bg-gray-200 pb-[56.25%] h-0"></div>

            {/* Tabs Skeleton */}
            <div className="flex mb-8 space-x-2 p-2 bg-gray-200 rounded-xl">
              <div className="flex-1 h-11 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 h-11 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 h-11 bg-gray-300 rounded-lg"></div>
            </div>

            {/* Content Sections Skeleton */}
            <div className="space-y-12">
              {/* About Section */}
              <div>
                <div className="h-8 w-1/3 bg-gray-300 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Benefits Section */}
              <div>
                <div className="h-8 w-1/2 bg-gray-300 rounded-lg mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-5 p-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                      <div className="h-5 w-full bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Syllabus Section */}
              <div>
                <div className="h-8 w-1/2 bg-gray-300 rounded-lg mb-6"></div>
                <div className="space-y-4">
                  <div className="h-16 w-full bg-gray-200 rounded-xl"></div>
                  <div className="h-16 w-full bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-1/3">
            <div className="sticky top-28">
              <div className="p-6 bg-gray-200 rounded-3xl">
                <div className="h-10 w-1/2 bg-gray-300 rounded-lg mb-5"></div>
                <div className="h-14 w-full bg-gray-300 rounded-xl"></div>
                <div className="mt-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                      <div className="h-5 w-full bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DetailCourseSkeleton;
