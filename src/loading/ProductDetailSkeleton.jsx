import ProductCardSkeleton from '../loader/ProductCardSkeleton';

// Mirrors ProductDetailsPage: breadcrumb, gallery (thumbs + big image) beside the details
// column (title, price, add-to-cart row, accordions, trust badges), then similar products.
export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-72 max-w-full bg-gray-200 rounded mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12 gap-8 mb-16 lg:items-stretch">
        {/* GALLERY */}
        <div className="flex flex-col-reverse md:flex-row gap-3">
          <div className="flex md:flex-col gap-3 shrink-0">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
          <div className="w-full md:flex-1 h-[340px] sm:h-[420px] lg:h-auto lg:min-h-[560px] bg-gray-200 rounded-xl" />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col">
          {/* Title, brand, rating */}
          <div className="h-8 w-4/5 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
          <div className="h-4 w-48 bg-gray-200 rounded mb-5" />

          {/* Price */}
          <div className="flex items-center gap-4 py-4 border-t border-gray-100">
            <div className="h-9 w-36 bg-gray-300 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-10 w-10 bg-gray-200 rounded-full" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-5" />

          {/* Wishlist / quantity / add to cart */}
          <div className="flex gap-3 mb-6">
            <div className="h-12 w-12 bg-gray-200 rounded-xl shrink-0" />
            <div className="h-12 w-32 bg-gray-200 rounded-xl shrink-0" />
            <div className="h-12 flex-1 bg-gray-300 rounded-xl" />
          </div>

          {/* Accordions */}
          <div className="border-t border-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          <div className="flex-1 min-h-8" />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="h-3 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIMILAR PRODUCTS */}
      <div className="h-7 w-56 bg-gray-200 rounded-md mx-auto mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={['', '', 'hidden sm:block', 'hidden md:block', 'hidden lg:block'][i]}
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
