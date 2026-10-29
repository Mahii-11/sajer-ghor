import React from 'react';

// Mirrors ProductCard: square image on mobile, centered brand / title / price / rating / size, two buttons.
export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl sm:rounded-[22px] overflow-hidden flex flex-col justify-between w-full shadow-sm animate-pulse">
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-200">
        <div className="absolute top-0 left-0 bg-slate-300 h-6 w-16 rounded-br-xl" />
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col grow justify-between">
        <div className="flex flex-col items-center gap-2 sm:gap-4">
          {/* Brand */}
          <div className="h-3 bg-slate-200 rounded w-16" />
          {/* Title (2 lines) */}
          <div className="w-full space-y-1.5">
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-2/3 mx-auto" />
          </div>
          {/* Price */}
          <div className="h-5 bg-slate-300 rounded w-24" />
          {/* Rating */}
          <div className="h-3.5 bg-slate-200 rounded w-28" />
          {/* Size chip */}
          <div className="h-5 bg-slate-200 rounded-full w-12" />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full pt-3 sm:pt-6">
          <div className="bg-slate-200 h-9 rounded-xl" />
          <div className="bg-slate-300 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
