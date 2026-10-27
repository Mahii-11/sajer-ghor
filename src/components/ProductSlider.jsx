import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

const GAP = 12; // matches gap-3
const SLIDE_MS = 700;
const AUTO_MS = 3500;

export const formatSectionProduct = (item) => ({
  id: item.id,
  name: item.name,
  brand: item.brand_name,
  image: item.image,
  slug: item.slug,
  type: item.type,
  minPrice: item.min_price,
  maxPrice: item.max_price,
  price: item.price,
  offer_price: item.offer_price,
});

const getPerView = (width) => (width >= 768 ? 4 : width >= 640 ? 3 : 2);

export function SliderHeader({ title, viewAllTo, className = '' }) {
  return (
    <div className={`flex items-end justify-between ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide relative inline-block">
        {title}
      </h2>

      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#db2777] hover:text-black transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/**
 * Infinite product slider with auto-slide, arrows and a "View All" link.
 * direction "left"  -> items move left (next item comes in from the right)
 * direction "right" -> items move right (previous item comes in from the left)
 */
export default function ProductSlider({ title, products, viewAllTo, direction = 'left', showHeader = true }) {
  const viewportRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  const posRef = useRef(0);
  const busyRef = useRef(false);
  const snapTimer = useRef(null);

  const n = products.length;
  const perView = getPerView(width);
  const canSlide = width > 0 && n > perView;
  const autoStep = direction === 'right' ? -1 : 1;

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reset to the first real slide whenever layout or data changes
  useEffect(() => {
    clearTimeout(snapTimer.current);
    busyRef.current = false;
    posRef.current = perView;
    setAnimate(false);
    setPos(perView);
  }, [perView, n]);

  useEffect(() => () => clearTimeout(snapTimer.current), []);

  const step = useCallback((dir) => {
    if (!canSlide || busyRef.current) return;
    busyRef.current = true;
    setAnimate(true);
    posRef.current += dir;
    setPos(posRef.current);

    snapTimer.current = setTimeout(() => {
      // jump from a cloned edge back to the identical real position
      let p = posRef.current;
      if (p >= perView + n) p = perView;
      else if (p <= 0) p = n;
      if (p !== posRef.current) {
        posRef.current = p;
        setAnimate(false);
        setPos(p);
      }
      busyRef.current = false;
    }, SLIDE_MS);
  }, [canSlide, perView, n]);

  // Auto slide (timer restarts after every move, so manual clicks reset it)
  useEffect(() => {
    if (!canSlide || paused) return;
    const t = setTimeout(() => step(autoStep), AUTO_MS);
    return () => clearTimeout(t);
  }, [pos, canSlide, paused, step, autoStep]);

  const cardWidth = width > 0 ? (width - GAP * (perView - 1)) / perView : 0;

  const items = canSlide
    ? [...products.slice(-perView), ...products, ...products.slice(0, perView)]
    : products;
  const offset = canSlide ? pos * (cardWidth + GAP) : 0;

  return (
    <section>
      {showHeader && (
        <SliderHeader title={title} viewAllTo={viewAllTo} className="mb-8 md:mb-10" />
      )}

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div ref={viewportRef} className="overflow-hidden py-4 -my-4">
          {cardWidth > 0 && (
            <div
              className="flex will-change-transform"
              style={{
                gap: GAP,
                transform: `translate3d(${-offset}px, 0, 0)`,
                transition: animate ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : 'none',
              }}
            >
              {items.map((item, i) => (
                <div key={`${item.id}-${i}`} className="shrink-0" style={{ width: cardWidth }}>
                  <ProductCard product={formatSectionProduct(item)} />
                </div>
              ))}
            </div>
          )}
        </div>

        {canSlide && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous products"
              className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next products"
              className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
