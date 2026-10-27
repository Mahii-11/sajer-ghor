import React, { useEffect, useState } from 'react';
import ProductSlider from './ProductSlider';
import { getTopRankedProduct } from '../services/api';
import ProductSectionSkeleton from '../loader/ProductSectionSkeleton';
import { Link } from 'react-router-dom';
// import SectionBanner from './SectionBanner';

export default function TopRankProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await getTopRankedProduct();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading top ranking products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return <ProductSectionSkeleton />;
  }

  if (products.length === 0) return null;

  return (
    <div id="top-ranking-products">
      <div className="mb-6 md:mb-8">
        {/* Raw Tailwind banner (kept for comparison with the image banner)
        <SectionBanner
          eyebrow="Best Sellers"
          title="Top Ranking Products"
          subtitle="Most loved picks, chosen by our customers"
          viewAllTo="/top-ranking-products"
          theme="pink"
        />
        */}
        <Link to="/top-ranking-products" className="block rounded-2xl overflow-hidden">
          <img
            src="/images/1920x200.webp"
            alt="Top Ranking Products"
            className="w-full h-auto object-cover"
          />
        </Link>
      </div>
      <ProductSlider
        title="TOP RANKING PRODUCTS"
        products={products}
        viewAllTo="/top-ranking-products"
        direction="left"
        showHeader={false}
      />
    </div>
  );
}


