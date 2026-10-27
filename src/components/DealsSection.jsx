import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import { getCampaigns } from '../services/api';

export default function DealsSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getCampaigns();
        setDeals(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching deals/campaigns data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const defaultBanner = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600&auto=format&fit=crop";

  return (
    <section id="deals-section">
      <div>
        <SectionTitle title="DEALS YOU CANNOT MISS"  />

        {/* Loading State Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div 
                key={item} 
                className="rounded-lg aspect-square bg-gray-200 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          /* Dynamic Content Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {deals.map((deal) => (
              <Link
                key={deal.id}
                to={`/campaign/${deal.slug}`}
                id={`deal-card-${deal.slug}`}
                className="group overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer block"
              >
                <img
                  src={deal.banner || defaultBanner}
                  alt={deal.name || "Campaign Offer"}
                  className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}