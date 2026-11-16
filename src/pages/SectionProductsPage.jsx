import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { formatSectionProduct } from '../components/ProductSlider';
import ProductCardSkeleton from '../loader/ProductCardSkeleton';

// Shows every product of a home page section (e.g. Top Ranking, Recommended)
// The banner image replaces the plain text title when one is available:
//   `fetchBanner` — optional async fn returning { banner } (same API as the home page section)
//   `banner`      — optional static image URL, used as fallback when the API gives none
export default function SectionProductsPage({ title, fetchProducts, fetchBanner, banner }) {
  const [products, setProducts] = useState([]);
  const [apiBanner, setApiBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (active) setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Error fetching ${title}:`, error);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [fetchProducts, title]);

  useEffect(() => {
    if (!fetchBanner) return undefined;
    let active = true;
    fetchBanner()
      .then((res) => { if (active) setApiBanner(res?.banner || null); })
      .catch((error) => console.error(`Error fetching ${title} banner:`, error));
    return () => { active = false; };
  }, [fetchBanner, title]);

  const bannerSrc = apiBanner || banner || null;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {bannerSrc ? (
        <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden">
          <img
            src={bannerSrc}
            alt={title}
            className="w-full h-auto object-cover"
          />
          <h1 className="sr-only">{title}</h1>
        </div>
      ) : (
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-wide">
            {title}
          </h1>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={formatSectionProduct(item)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm font-medium">No products found.</p>
          <Link to="/shop" className="inline-block mt-4 text-[#db2777] text-sm font-bold hover:underline">
            Browse all products
          </Link>
        </div>
      )}
    </main>
  );
}
