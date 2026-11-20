import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Gem } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../loader/ProductCardSkeleton';
import { getShowcaseProducts } from '../services/api';

const COMING_SOON = {
  her: {
    title: 'Something Beautiful Is Coming',
    label: 'For Her',
    icon: Sparkles,
    glow: 'from-pink-100 via-white to-rose-100',
    accent: 'text-[#db2777]',
    ring: 'bg-pink-50 ring-pink-100',
    button: 'bg-[#db2777] hover:bg-[#be185d]',
  },
  him: {
    title: 'Something Exceptional Is Coming',
    label: 'For Him',
    icon: Gem,
    glow: 'from-slate-100 via-white to-blue-100',
    accent: 'text-[#1d4ed8]',
    ring: 'bg-blue-50 ring-blue-100',
    button: 'bg-slate-900 hover:bg-slate-700',
  },
  default: {
    title: 'Something Special Is Coming',
    label: 'Showcase',
    icon: Sparkles,
    glow: 'from-pink-100 via-white to-rose-100',
    accent: 'text-[#db2777]',
    ring: 'bg-pink-50 ring-pink-100',
    button: 'bg-[#db2777] hover:bg-[#be185d]',
  },
};

// Pick the message from the showcase slug/title ("for-her", "For Him", ...)
const comingSoonVariant = (slug, title) => {
  const key = `${slug || ''} ${title || ''}`.toLowerCase();
  if (/\b(him|his|men|male)\b/.test(key)) return 'him';
  if (/\b(her|hers|women|female)\b/.test(key)) return 'her';
  return 'default';
};

function ComingSoon({ variant }) {
  const c = COMING_SOON[variant];
  const Icon = c.icon;

  return (
    <div className="relative overflow-hidden max-w-2xl mx-auto rounded-3xl border border-gray-100 shadow-sm">
      <div className={`absolute inset-0 bg-linear-to-br ${c.glow}`} />
      <div className="relative px-6 py-14 md:py-20 text-center">
        <div className={`mx-auto w-20 h-20 rounded-full ring-8 flex items-center justify-center ${c.ring}`}>
          <Icon className={`w-9 h-9 ${c.accent}`} strokeWidth={1.5} />
        </div>

        <span className={`block mt-6 text-xs font-semibold tracking-[0.3em] uppercase ${c.accent}`}>
          {c.label}
        </span>
        <h2 className="mt-3 text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          {c.title}
        </h2>
        <p className="mt-3 text-sm md:text-base text-gray-500">
          Our collection is being curated with care. Stay tuned.
        </p>

        <Link
          to="/shop"
          className={`inline-flex items-center justify-center mt-8 h-11 px-7 rounded-full text-white text-sm font-bold transition-colors ${c.button}`}
        >
          Explore Other Products
        </Link>
      </div>
    </div>
  );
}

export default function ShowcaseProductsPage() {
  const { slug } = useParams();
  const [showcase, setShowcase] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowcaseProducts = async () => {
      try {
        setLoading(true);
        const res = await getShowcaseProducts(slug);
        setShowcase(res?.data || null);
        setProducts(Array.isArray(res?.data?.products) ? res.data.products : []);
      } catch (error) {
        console.error('Error fetching showcase products:', error);
        setShowcase(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcaseProducts();
  }, [slug]);

  return (
    <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      <div className="text-center mb-8 md:mb-10">
        <span className="text-[#db2777] text-xs font-semibold tracking-widest uppercase block mb-2">
          Showcase
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-wide relative inline-block">
          {loading ? 'Loading...' : (showcase?.showcase_title || 'Products')}
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
        <ComingSoon variant={comingSoonVariant(slug, showcase?.showcase_title)} />
      )}
    </main>
  );
}
