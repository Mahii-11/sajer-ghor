import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { formatSectionProduct } from '../components/ProductSlider';
import ProductCardSkeleton from '../loader/ProductCardSkeleton';

// Shows every product of a home page section (e.g. Top Ranking, Recommended)
export default function SectionProductsPage({ title, fetchProducts }) {
  const [products, setProducts] = useState([]);
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

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-wide relative inline-block">
          {title}
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#db2777] rounded-full"></span>
        </h1>
      </div>

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
