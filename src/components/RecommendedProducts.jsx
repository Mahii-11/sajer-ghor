import React, { useEffect, useState } from 'react'
import ProductSlider from './ProductSlider'
import { getRecommendProduct } from '../services/api';
import ProductSectionSkeleton from '../loader/ProductSectionSkeleton';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
// import SectionBanner from './SectionBanner';

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { banner, products } = await getRecommendProduct();
        setProducts(Array.isArray(products) ? products : []);
        setBanner(banner || null);
      } catch (error) {
        console.error("Error loading recommended products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) {
    return <ProductSectionSkeleton />;
  }

  if (products.length === 0) return null;

  return (
    <div id="recommended-products">
      <div className="mb-6 md:mb-8">
        {/* Raw Tailwind banner (kept for comparison with the image banner)
        <SectionBanner
          eyebrow="Just For You"
          title="Recommended Products"
          subtitle="Handpicked products you might love"
          viewAllTo="/recommended-products"
          theme="indigo"
        />
        */}
        {banner && (
          <Link to="/recommended-products" className="group relative block rounded-2xl overflow-hidden">
            <img
              src={banner}
              alt="Recommended Products"
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
        title="RECOMMENDED PRODUCTS"
        products={products}
        viewAllTo="/recommended-products"
        direction="right"
        showHeader={false}
      />
    </div>
  )
}


