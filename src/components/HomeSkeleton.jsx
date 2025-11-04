
import React from 'react';

const SkeletonCard = () => (
  <div className="w-full p-4 mx-auto bg-white rounded-md shadow-md">
    <div className="w-full h-32 bg-gray-300 rounded-md animate-pulse"></div>
    <div className="mt-4">
      <div className="w-3/4 h-4 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-1/2 h-4 mt-2 bg-gray-300 rounded animate-pulse"></div>
    </div>
  </div>
);

const HomeSkeleton = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section Skeleton */}
      <div className="grid items-center grid-cols-1 gap-8 py-10 md:py-20 md:grid-cols-2 md:gap-12">
        <div className="px-2 text-center md:text-left md:px-8 lg:px-12">
          <div className="w-3/4 h-12 mx-auto bg-gray-300 rounded-lg md:mx-0 animate-pulse"></div>
          <div className="w-1/2 h-8 mx-auto mt-4 bg-gray-300 rounded-lg md:mx-0 animate-pulse"></div>
          <div className="w-full h-6 mt-6 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-48 h-12 mx-auto mt-8 bg-gray-300 rounded-lg md:mx-0 animate-pulse"></div>
        </div>
        <div className="relative flex items-center justify-center px-2 md:px-0">
          <div className="w-full max-w-2xl h-96 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 text-center bg-gray-200 rounded-3xl animate-pulse">
            <div className="w-24 h-12 mx-auto bg-gray-300 rounded-lg"></div>
            <div className="w-3/4 h-4 mx-auto mt-2 bg-gray-300 rounded-lg"></div>
          </div>
        ))}
      </div>

      {/* Categories Section Skeleton */}
      <div>
        <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row">
          <div className="w-1/3 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-8 text-center bg-gray-200 rounded-3xl animate-pulse">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-300 rounded-full"></div>
              <div className="w-3/4 h-6 mx-auto mb-2 bg-gray-300 rounded-lg"></div>
              <div className="w-1/2 h-4 mx-auto bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Courses Section Skeleton */}
      <div>
        <div className="flex flex-col items-center justify-between gap-8 mb-12 text-center md:flex-row md:text-left">
          <div className="w-1/3 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-24 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>

      {/* Mentors Section Skeleton */}
      <div>
        <div className="flex flex-col items-center justify-between gap-8 mb-12 text-center md:flex-row md:text-left">
          <div className="w-1/3 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-6 text-center bg-gray-200 rounded-3xl animate-pulse">
              <div className="w-24 h-24 mx-auto bg-gray-300 rounded-full"></div>
              <div className="w-32 h-6 mx-auto mt-4 bg-gray-300 rounded-lg"></div>
              <div className="w-24 h-4 mx-auto mt-2 bg-gray-300 rounded-lg"></div>
              <div className="w-20 h-4 mx-auto mt-4 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
