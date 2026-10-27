import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useMotionValue, useAnimationFrame, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

// আপনার প্রজেক্টের API helper (যেমন: api.js) থেকে ইম্পোর্ট করুন
import { getTopBrands } from '../services/api';

const AUTO_SPEED_PX_PER_SEC = 40;
const REPEAT_COUNT = 3;
// How long (ms) to wait after a manual arrow click before auto-slide resumes.
const RESUME_DELAY_MS = 5000;
// How long (ms) to wait after the cursor leaves the slider before auto-slide resumes.
const HOVER_RESUME_DELAY_MS = 5000;

// Skeleton Loader Component (same card widths as the real slider)
function TopBrandsSkeleton() {
  return (
    <div className="flex gap-3 sm:gap-4 overflow-hidden animate-pulse py-2">
      {Array.from({ length: 9 }).map((_, item) => (
        <div
          key={item}
          className="shrink-0 w-[calc((100%-12px)/2)] sm:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)] xl:w-[calc((100%-80px)/6)] 2xl:w-[calc((100%-96px)/7)] aspect-[15/8] sm:aspect-[25/16] lg:aspect-[3/2] xl:aspect-[5/3] bg-stone-200/80 rounded-2xl"
        />
      ))}
    </div>
  );
}

export default function TopBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const trackRef = useRef(null);
  const firstCardRef = useRef(null);
  const x = useMotionValue(0);
  const step = useRef(140);
  const oneSetWidth = useRef(0);

  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const resumeTimeoutRef = useRef(null);
  const hoverResumeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const res = await getTopBrands();
        setBrands(Array.isArray(res) ? res : res?.data || []);
      } catch (error) {
        console.error('Error fetching top brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Measure card width & total gap
  const measure = useCallback(() => {
    if (!firstCardRef.current || !trackRef.current || brands.length === 0) return;

    const cardWidth = firstCardRef.current.getBoundingClientRect().width;
    const trackStyles = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;

    step.current = cardWidth + gap;
    oneSetWidth.current = step.current * brands.length;

    if (oneSetWidth.current > 0) {
      x.set(-oneSetWidth.current);
    }
  }, [brands.length, x]);

  useLayoutEffect(() => {
    if (!loading && brands.length > 0) {
      measure();
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
  }, [loading, brands, measure]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (hoverResumeTimeoutRef.current) clearTimeout(hoverResumeTimeoutRef.current);
    };
  }, []);

  // Infinite Scroll Loop
  useAnimationFrame((_, delta) => {
    if (isHovering || isManuallyPaused || isAnimatingRef.current) return;
    if (loading || oneSetWidth.current === 0) return;

    let next = x.get() - (AUTO_SPEED_PX_PER_SEC * delta) / 1000;

    if (next <= -2 * oneSetWidth.current) {
      next += oneSetWidth.current;
    }

    x.set(next);
  });

  const handleMouseEnter = () => {
    if (hoverResumeTimeoutRef.current) clearTimeout(hoverResumeTimeoutRef.current);
    setIsHovering(true);
  };

  // Keep the slider paused for a while after the cursor leaves, instead of
  // snapping back into motion immediately.
  const handleMouseLeave = () => {
    if (hoverResumeTimeoutRef.current) clearTimeout(hoverResumeTimeoutRef.current);
    hoverResumeTimeoutRef.current = setTimeout(() => {
      setIsHovering(false);
    }, HOVER_RESUME_DELAY_MS);
  };

  const pauseThenResume = () => {
    setIsManuallyPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsManuallyPaused(false);
    }, RESUME_DELAY_MS);
  };

  // Keep x inside the middle copy after an arrow move so the loop never runs out.
  const normalizeAfterManualMove = () => {
    if (oneSetWidth.current === 0) return;
    let val = x.get();
    if (val <= -2 * oneSetWidth.current) val += oneSetWidth.current;
    if (val > -oneSetWidth.current + step.current) val -= oneSetWidth.current;
    x.set(val);
  };

  const slideBy = (direction) => {
    if (isAnimatingRef.current || oneSetWidth.current === 0) return;
    pauseThenResume();
    isAnimatingRef.current = true;

    animate(x, x.get() + direction * step.current, {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        normalizeAfterManualMove();
        isAnimatingRef.current = false;
      },
    });
  };

  // Finger / mouse drag support. Auto-slide pauses while dragging and resumes after.
  const wasDraggedRef = useRef(false);
  const handleDragStart = () => {
    wasDraggedRef.current = true;
    setIsManuallyPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };
  const handleDragEnd = () => {
    normalizeAfterManualMove();
    pauseThenResume();
    // let the click event that follows a drag be ignored
    setTimeout(() => { wasDraggedRef.current = false; }, 0);
  };
  const blockClickAfterDrag = (e) => {
    if (wasDraggedRef.current) e.preventDefault();
  };

  const handleNext = () => slideBy(-1);
  const handlePrev = () => slideBy(1);

  // Array Repeat Mapping
  const repeated = Array.from({ length: REPEAT_COUNT }).flatMap((_, copyIdx) =>
    brands.map((brand, idx) => ({
      ...brand,
      _key: `${copyIdx}-${brand.id ?? idx}`,
      _isMeasureTarget: copyIdx === 1 && idx === 0,
    }))
  );

  return (
    <section>
      <div>
        {/* Section Heading */}
        <SectionTitle title="TOP BRANDS" />

        {/* Auto-Sliding Brand Logos */}
        <div className="w-full px-5">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="overflow-hidden">
              {loading ? (
                <TopBrandsSkeleton />
              ) : (
                <motion.div
                  ref={trackRef}
                  className="flex gap-3 sm:gap-4 cursor-grab active:cursor-grabbing py-2"
                  style={{ x, willChange: 'transform' }}
                  drag="x"
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {repeated.map((brand) => (
                    <a
                      key={brand._key}
                      ref={brand._isMeasureTarget ? firstCardRef : null}
                      href={brand.slug ? `/brand/${brand.slug}` : '#'}
                      draggable={false}
                      onClickCapture={blockClickAfterDrag}
                      className="group block shrink-0 w-[calc((100%-12px)/2)] sm:w-[calc((100%-48px)/4)] lg:w-[calc((100%-64px)/5)] xl:w-[calc((100%-80px)/6)] 2xl:w-[calc((100%-96px)/7)] overflow-hidden rounded-2xl bg-white ring-1 ring-pink-100 shadow-[0_4px_14px_rgba(230,28,92,0.10)] hover:shadow-[0_8px_22px_rgba(230,28,92,0.20)] active:scale-95 transition-all duration-200"
                    >
                      <div className="overflow-hidden bg-[#F3F4F6]">
                        <img
                          src={brand.logo || brand.logo_image || brand.logoUrl}
                          alt={brand.name}
                          className="w-full aspect-[15/8] sm:aspect-[25/16] lg:aspect-[3/2] xl:aspect-[5/3] object-cover block group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                    </a>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Navigation Arrows */}
            {!loading && brands.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-4 sm:-left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-10 cursor-pointer"
                  aria-label="Previous brand"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-4 sm:-right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none z-10 cursor-pointer"
                  aria-label="Next brand"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}