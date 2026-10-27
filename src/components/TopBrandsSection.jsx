import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import { getTopBrandOffers } from '../services/api';
import TopBrandsSkeleton from '../loader/TopBrandsSkeleton';

export default function TopBrandsSection() { 
  const [topbrand, setTopBrand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopBrand = async () => {
      try {
        setLoading(true);
        const data = await getTopBrandOffers();
        // API response specific handle: data.data check
        const list = data?.data || data;
        setTopBrand(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error("Error fetching Top Brand data", error);
      } finally {
        setLoading(false);
      }
    };

    loadTopBrand();
  }, []);

  if (loading) return <TopBrandsSkeleton />

  return (
    <section id="top-brands-section">
      <div>
        <SectionTitle title="TOP BRANDS & OFFERS"  />
                    
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {topbrand.map((brand) => (
            <Link
              key={brand.id}
              to={`/brand/${brand.slug}`}
              className="group block overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <img
                src={brand.banner_image}
                alt={brand.name}
                className="w-full h-auto aspect-square md:aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}