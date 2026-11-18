import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTopBrands } from '../services/api';

// Pinterest-style masonry: CSS columns keep each logo at its natural height,
// so cards of different sizes pack tightly with no empty gaps.
const COLUMNS = 'columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 sm:gap-4';

function BrandsSkeleton() {
  const heights = ['h-28', 'h-40', 'h-32', 'h-48', 'h-36', 'h-24', 'h-44', 'h-32'];
  return (
    <div className={`${COLUMNS} animate-pulse`}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className={`${heights[i % heights.length]} mb-3 sm:mb-4 break-inside-avoid rounded-2xl bg-stone-200/80`}
        />
      ))}
    </div>
  );
}

export default function AllBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    getTopBrands()
      .then((res) => setBrands(Array.isArray(res) ? res : res?.data || []))
      .catch((err) => {
        console.error('Error fetching brands:', err);
        setBrands([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="text-center mb-8 md:mb-10">
        <span className="text-[#db2777] text-xs font-semibold tracking-widest uppercase block mb-2">
          Explore
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-wide uppercase">
          All Brands
        </h1>
      </div>

      {loading ? (
        <BrandsSkeleton />
      ) : brands.length > 0 ? (
        <div className={COLUMNS}>
          {brands.map((brand) => (
            <Link
              key={brand.id ?? brand.slug}
              to={brand.slug ? `/brand/${brand.slug}` : '#'}
              title={brand.name}
              className="group mb-3 sm:mb-4 block break-inside-avoid overflow-hidden rounded-2xl bg-white ring-1 ring-pink-100 shadow-[0_4px_14px_rgba(230,28,92,0.10)] hover:shadow-[0_8px_22px_rgba(230,28,92,0.20)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <img
                src={brand.logo || brand.logo_image || brand.logoUrl}
                alt={brand.name}
                loading="lazy"
                className="block w-full h-auto group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-16">No brands found.</p>
      )}
    </main>
  );
}
