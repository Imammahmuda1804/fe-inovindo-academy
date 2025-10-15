'use client';

const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="flex-shrink-0 h-12 w-20 mr-4 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 w-24 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 w-28 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-5 w-32 bg-gray-200 rounded"></div>
    </td>
  </tr>
);

const TransactionsSkeleton = () => {
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

            {/* Search Skeleton */}
            <div className="mb-8 p-4 bg-white/60 rounded-2xl shadow-md">
              <div className="h-11 w-full bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-200/80 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[...Array(5)].map((_, i) => (
                      <th key={i} scope="col" className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <TableRowSkeleton key={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionsSkeleton;
