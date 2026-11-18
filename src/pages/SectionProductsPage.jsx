import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { formatSectionProduct } from '../components/ProductSlider';
import ProductCardSkeleton from '../loader/ProductCardSkeleton';

// Shows every product of a home page section (e.g. Top Ranking, Recommended).
// `fetchProducts(page)` returns { banner, products, pagination } straight from the API:
// the banner image replaces the plain text title, and "Load more" fetches the next page.
export default function SectionProductsPage({ title, fetchProducts }) {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchProducts(1);
        if (!active) return;
        setProducts(res.products);
        setBanner(res.banner);
        setPagination(res.pagination);
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

  const hasMore = (pagination.current_page ?? 1) < (pagination.last_page ?? 1);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetchProducts((pagination.current_page ?? 1) + 1);
      setProducts((prev) => [...prev, ...res.products]);
      setPagination(res.pagination);
    } catch (error) {
      console.error(`Error loading more ${title}:`, error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {banner ? (
        <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden">
          <img src={banner} alt={title} className="w-full h-auto object-cover" />
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
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((item) => (
              <ProductCard key={item.id} product={formatSectionProduct(item)} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="h-11 px-8 rounded-full bg-[#db2777] hover:bg-[#be185d] text-white text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-60"
              >
                {loadingMore ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
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
