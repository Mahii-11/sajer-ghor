import React, { useEffect, useState } from 'react';
import ProductSlider from './ProductSlider';
import { getTopRankedProduct } from '../services/api';
import ProductSectionSkeleton from '../loader/ProductSectionSkeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// import SectionBanner from './SectionBanner';

export default function TopRankProduct() {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const { banner, products } = await getTopRankedProduct();
        setProducts(Array.isArray(products) ? products : []);
        setBanner(banner || null);
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
        {banner && (
          <Link to="/top-ranking-products" className="group relative block rounded-2xl overflow-hidden">
            <img
              src={banner}
              alt="Top Ranking Products"
              className="w-full h-auto object-cover"
            />
            <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-[13px] font-bold uppercase tracking-wide text-gray-900 shadow-sm transition-colors group-hover:bg-white group-hover:text-[#db2777]">
              View All
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        )}
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


