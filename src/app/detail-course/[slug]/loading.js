export default function Loading() {
  return (
    <div className="relative min-h-screen font-sans bg-gray-50 pt-24 px-2 sm:px-6 md:px-8 lg:px-16">
      <main className="container mx-auto py-8 relative">
        {/* Course Header/Hero Skeleton */}
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-5 w-1/2 bg-gray-200 rounded-lg mb-2"></div>
          <div className="flex items-center mt-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
            <div className="h-4 w-1/4 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Two-column layout for main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Course Content/Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description/About section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-1/3 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
              </div>
            </div>

            {/* Curriculum/Materi section */}
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-1/4 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                    <div className="h-4 flex-grow bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing/Enrollment Card */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 w-1/2 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-full bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-12 w-full bg-blue-200 rounded-lg mt-6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
