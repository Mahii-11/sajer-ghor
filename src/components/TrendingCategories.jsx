import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Link ইম্পোর্ট করা হলো
import SectionTitle from './SectionTitle';
import { getTrendingCategory } from '../services/api';

export default function TrendingCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        setLoading(true);
        const res = await getTrendingCategory();
        const list = Array.isArray(res) ? res : res?.data || [];
        setCategories(list);
      } catch (error) {
        console.error("Error fetching Trending data", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  const defaultImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop";

  return (
    <div>
      <section id="trending-categories">
        <SectionTitle title="TRENDING CATEGORIES"  />
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-3xl aspect-[3/4] bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              /* div বাদ দিয়ে React Router-এর Link ব্যবহার করা হয়েছে */
              <Link 
                to={`/category/${cat.slug}`}
                key={cat.id}
                id={`trending-cat-card-${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer shadow-md border border-white/40 bg-gray-100 block"
              >
                {/* Image */}
                <img 
                  src={cat.image || defaultImage} 
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 transition-opacity duration-300"></div>

                {/* Details */}
                <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                  <h3 className="text-white text-base font-bold uppercase tracking-tight leading-tight group-hover:text-pink-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-pink-200 font-bold block mt-0.5">
                    {cat.products_count ?? 0} Products
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}