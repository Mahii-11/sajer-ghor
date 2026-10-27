import React from 'react';

export default function ForHerHimSkeleton() {
  return (
    <section className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="relative h-80 sm:h-150 rounded-2xl overflow-hidden shadow-md bg-gray-200"
          >
            <div className="absolute bottom-6 left-6 space-y-2">
              <div className="h-5 w-32 bg-gray-300 rounded-full"></div>
              <div className="h-7 w-24 bg-gray-300 rounded"></div>
              <div className="h-3 w-48 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
