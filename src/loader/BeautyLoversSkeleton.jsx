import React from 'react';

export default function BeautyLoversSkeleton({ count = 3 }) {
  const skeletonItems = Array.from({ length: count });

  return (
    <section className="py-12 px-4 flex flex-col items-center animate-pulse">
      {/* Heading Skeleton */}
      <div className="h-7 w-52 bg-gray-200 rounded-md mb-8"></div>

      {/* Cards Row Skeleton */}
      <div className="max-w-6xl w-full flex justify-center gap-6 overflow-hidden px-2">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="relative pt-16 w-[300px] sm:w-[320px] flex-shrink-0"
          >
            {/* Avatar Placeholder */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border border-pink-100 bg-gray-200 z-10"></div>

            {/* Card Placeholder */}
            <div className="w-full rounded-[24px] border border-pink-100 pt-20 pb-6 px-6 flex flex-col justify-between min-h-[360px]">
              <div className="flex flex-col items-center">
                <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-28 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 w-full">
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-full bg-gray-200 rounded"></div>
                  <div className="h-3 w-3/4 bg-gray-200 rounded mx-auto"></div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="w-10 h-12 bg-gray-200 rounded"></div>
                <div className="text-right space-y-2">
                  <div className="h-2.5 w-24 bg-gray-200 rounded ml-auto"></div>
                  <div className="h-2.5 w-16 bg-gray-200 rounded ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
