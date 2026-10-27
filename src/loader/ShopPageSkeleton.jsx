import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

// মডার্ন স্কেলেটন লোডার কম্পোনেন্ট
export default function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-6 animate-pulse">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row">
        
        {/* Sidebar Skeleton */}
        <aside className="w-full shrink-0 lg:w-64 space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm h-36">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-full mb-3" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm h-64">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1">
          {/* Search & Toolbar Skeleton */}
          <div className="mb-6 space-y-4">
            <div className="h-11 bg-white border border-gray-200 rounded-xl w-full" />
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-9 bg-white border border-gray-200 rounded-xl w-44" />
            </div>
          </div>

          {/* Product Cards Grid Skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}