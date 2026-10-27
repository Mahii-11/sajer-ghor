import React from 'react';

// Mirrors TopBrandsSection: centered section title + 2 / 3 column image grid.
export default function TopBrandsSkeleton() {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <section id="top-brands-section" className="animate-pulse">
      <div>
        {/* Section Title Skeleton */}
        <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
          <div className="h-7 w-64 bg-gray-200 rounded-md" />
          <div className="h-1 w-12 bg-gray-200 rounded-full mt-3" />
        </div>

        {/* Grid Skeleton Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-100 bg-gray-100 shadow-sm"
            >
              <div className="w-full aspect-[16/9] bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
