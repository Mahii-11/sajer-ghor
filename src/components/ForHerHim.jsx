import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getShowcaseData } from '../services/api';
import ForHerHimSkeleton from '../loader/ForHerHimSkeleton';

// Alternating visual themes for the showcase cards (rose / slate), applied by index.
const THEMES = [
  {
    overlay: 'bg-linear-to-t from-pink-950/90 via-transparent to-black/20',
    badgeBg: 'bg-brand-pink',
    subtitleColor: 'text-pink-100',
    fallbackImg: '/images/womenper.jpg',
  },
  {
    overlay: 'bg-linear-to-t from-slate-950/95 via-transparent to-black/20',
    badgeBg: 'bg-amber-600',
    subtitleColor: 'text-gray-200',
    fallbackImg: '/images/menperfume.jpg',
  },
];

export default function ForHerHim() {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShowcases = async () => {
      try {
        setLoading(true);
        const data = await getShowcaseData();
        const list = Array.isArray(data) ? data : data?.data || [];
        setShowcases(list);
      } catch (error) {
        console.error('Error fetching showcase data', error);
      } finally {
        setLoading(false);
      }
    };

    loadShowcases();
  }, []);

  if (loading) return <ForHerHimSkeleton />;

  if (showcases.length === 0) return null;

  return (
    <section id="for-her-for-him">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {showcases.map((item, index) => {
          const theme = THEMES[index % THEMES.length];

          return (
            <Link
              to={`/showcase/${item.slug}`}
              key={item.id ?? item.slug ?? index}
              id={`banner-${item.slug ?? index}`}
              className="relative h-80 sm:h-150 rounded-2xl overflow-hidden group cursor-pointer shadow-md block"
            >
              <img
                src={item.bg_img || theme.fallbackImg}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <div className={`absolute inset-0 ${theme.overlay}`}></div>

              <div className="absolute bottom-6 left-6 text-white text-left">
                {item.badge && (
                  <span className={`${theme.badgeBg} text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-2 block w-max`}>
                    {item.badge}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{item.title}</h3>
                {item.subtitle && (
                  <p className={`text-sm ${theme.subtitleColor} mt-1`}>{item.subtitle}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
