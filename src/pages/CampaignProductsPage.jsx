import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../loader/ProductCardSkeleton';
import { getCampaignProducts } from '../services/api';

export default function CampaignProductsPage() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignProducts = async () => {
      try {
        setLoading(true);
        const res = await getCampaignProducts(slug);
        setCampaign(res?.data || null);
        setProducts(Array.isArray(res?.data?.products) ? res.data.products : []);
      } catch (error) {
        console.error('Error fetching campaign products:', error);
        setCampaign(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignProducts();
  }, [slug]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
     

      <div className="text-center mb-8 md:mb-10">
        <span className="text-[#db2777] text-xs font-semibold tracking-widest uppercase block mb-2">
          Offer
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-wide relative inline-block">
          {loading ? 'Loading...' : (campaign?.campaign_name || 'Products')}
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm font-medium">No products found for this offer.</p>
          <Link
            to="/shop"
            className="inline-block mt-4 text-[#db2777] text-sm font-bold hover:underline"
          >
            Browse all products
          </Link>
        </div>
      )}
    </main>
  );
}
