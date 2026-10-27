import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';

// Placeholder for a product slider section: banner, title row and one row of cards
// (2 / 3 / 4 / 5 visible, matching ProductSlider's breakpoints).
const CARD_VISIBILITY = [
  '',
  '',
  'hidden sm:block',
  'hidden md:block',
  'hidden lg:block',
];

export default function ProductSectionSkeleton({ withBanner = true }) {
  return (
    <section className="animate-pulse">
      {withBanner && (
        <div className="mb-6 md:mb-8 w-full aspect-[3/1] sm:aspect-[5/1] lg:aspect-[6/1] rounded-xl md:rounded-2xl bg-slate-200" />
      )}

      <div className="flex items-end justify-between mb-8 md:mb-10">
        <div className="h-7 w-56 bg-slate-200 rounded-md" />
        <div className="h-5 w-20 bg-slate-200 rounded-md" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CARD_VISIBILITY.map((visibility, index) => (
          <div key={index} className={visibility}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </section>
  );
}
