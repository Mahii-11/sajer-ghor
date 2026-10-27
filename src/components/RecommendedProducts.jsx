import React, { useEffect, useState } from 'react'
import ProductSlider from './ProductSlider'
import { getRecommendProduct } from '../services/api';
import ProductSectionSkeleton from '../loader/ProductSectionSkeleton';
import { Link } from 'react-router-dom';
// import SectionBanner from './SectionBanner';

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await getRecommendProduct();
        setProducts(Array.isArray(data) ? data : []);
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
        <Link to="/recommended-products" className="block rounded-2xl overflow-hidden">
          <img
            src="/images/Offer-Banner%202.jpg.jpeg"
            alt="Recommended Products"
            className="w-full h-auto object-cover"
          />
        </Link>
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


