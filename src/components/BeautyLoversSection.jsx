import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useAnimationFrame, animate } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTestimonials } from '../services/api';
import BeautyLoversSkeleton from '../loader/BeautyLoversSkeleton';

// Normalize a raw testimonial-data API object into the shape TestimonialCard
// expects. API shape: { id, name, image, rating, review, product: { name, slug, image } }
const formatTestimonial = (item, index) => {
  const product = item.product ?? {};
  const firstName = (item.name ?? '').split(' ')[0];

  return {
    id: item.id ?? index,
    name: item.name ?? '',
    avatarImg: item.image ?? item.avatarImg ?? '',
    rating: Number.isFinite(Number(item.rating)) ? Number(item.rating) : 5,
    review: item.review ?? '',
    productImg: product.image ?? '',
    productText: product.name
      ? `${firstName ? `${firstName} Recommends` : 'Recommends'} ${product.name}`
      : '',
    shopUrl: product.slug ? `/product-details/${product.slug}` : '#',
  };
};

// Single Card Component (Accepts item props)
const TestimonialCard = ({ item }) => {
  return (
    <div className="relative pt-16 w-full max-w-[320px]">
      {/* Top Profile Avatar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border border-pink-300  z-10 overflow-hidden flex items-center justify-center">
        {item.avatarImg ? (
          <img
            src={item.avatarImg}
            alt={item.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : null}
      </div>

      {/* Card Content Box */}
      <div className="rounded-[24px] border border-pink-300 pt-20 pb-6 px-6 text-center shadow-sm flex flex-col justify-between min-h-[360px]">
        <div>
          {/* User Name */}
          <h3 className="font-bold text-[#222222] text-lg tracking-wide mb-3">
            {item.name}
          </h3>

          {/* Star Rating */}
          <div className="flex justify-center gap-1 text-amber-500 mb-4">
            {[...Array(item.rating)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
          </div>

          {/* Review Text */}
          <p className="text-[#4A4A4A] text-[15px] leading-relaxed font-normal">
            {item.review}
          </p>
        </div>

        {/* Product Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
          {item.productImg && (
            <div className="w-10 h-12 bg-amber-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <img
                src={item.productImg}
                alt="Recommended Product"
                className="w-full h-full object-cover"
              draggable={false}
              />
            </div>
          )}

          <div className="text-right">
            <p className="text-[12px] font-semibold text-[#555555]">
              {item.productText}
            </p>
            <a
              href={item.shopUrl}
              className="text-[11px] font-extrabold text-pink-500 uppercase tracking-tight hover:underline"
            >
              Shop Now &gt;&gt;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// How fast the track drifts on its own, in pixels per second.
const AUTO_SPEED_PX_PER_SEC = 40;
// How long (ms) to wait after a manual arrow click before auto-slide resumes.
const RESUME_DELAY_MS = 2200;
// How long (ms) to wait after the cursor leaves the slider before auto-slide resumes.
const HOVER_RESUME_DELAY_MS = 5000;
// How many times the testimonial list is repeated to build the scrolling track.
// 3 copies give enough buffer on both sides so the loop never visibly "jumps".
const REPEAT_COUNT = 3;

// Main Section Component
export default function BeautyLoversSection() {
  const trackRef = useRef(null);
  const firstCardRef = useRef(null);

  const x = useMotionValue(0);
  const step = useRef(344); // px — one card width + gap, measured after mount
  const oneSetWidth = useRef(0); // px — width of a single copy of the list

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        const list = Array.isArray(data) ? data : data?.data || [];
        setTestimonials(list.map(formatTestimonial));
      } catch (error) {
        console.error('Error fetching testimonial data', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  const [isHovering, setIsHovering] = useState(false);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const resumeTimeoutRef = useRef(null);
  const hoverResumeTimeoutRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Measure the real card width + gap so the loop math lines up exactly with
  // what's on screen, and re-measure on resize (card widths change per breakpoint).
  const measure = useCallback(() => {
    if (!firstCardRef.current || !trackRef.current) return;

    const cardWidth = firstCardRef.current.getBoundingClientRect().width;
    const trackStyles = window.getComputedStyle(trackRef.current);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;

    step.current = cardWidth + gap;
    oneSetWidth.current = step.current * testimonials.length;

    // Start in the middle copy so there's room to move either direction
    // before a wrap-around reset is needed.
    if (oneSetWidth.current > 0) {
      x.set(-oneSetWidth.current);
    }
  }, [x, testimonials.length]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      if (hoverResumeTimeoutRef.current) clearTimeout(hoverResumeTimeoutRef.current);
    };
  }, []);

  // Continuous drift to the left — the actual "infinite" motion.
  useAnimationFrame((_, delta) => {
    if (isHovering || isManuallyPaused || isAnimatingRef.current) return;
    if (oneSetWidth.current === 0) return;

    let next = x.get() - (AUTO_SPEED_PX_PER_SEC * delta) / 1000;

    // Wrap seamlessly once we've drifted a full set-width to the left.
    if (next <= -2 * oneSetWidth.current) {
      next += oneSetWidth.current;
    }

    x.set(next);
  });

  const pauseThenResume = () => {
    setIsManuallyPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsManuallyPaused(false);
    }, RESUME_DELAY_MS);
  };

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

  const normalizeAfterManualMove = () => {
    if (oneSetWidth.current === 0) return;
    let val = x.get();
    if (val <= -2 * oneSetWidth.current) val += oneSetWidth.current;
    if (val > -oneSetWidth.current + step.current) val -= oneSetWidth.current;
    x.set(val);
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

  const handleNext = () => {
    if (isAnimatingRef.current) return;
    pauseThenResume();
    isAnimatingRef.current = true;

    animate(x, x.get() - step.current, {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        normalizeAfterManualMove();
        isAnimatingRef.current = false;
      },
    });
  };

  const handlePrev = () => {
    if (isAnimatingRef.current) return;
    pauseThenResume();
    isAnimatingRef.current = true;

    animate(x, x.get() + step.current, {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      onComplete: () => {
        normalizeAfterManualMove();
        isAnimatingRef.current = false;
      },
    });
  };

  // Repeat the list so the track is long enough to scroll through seamlessly.
  const repeated = Array.from({ length: REPEAT_COUNT }).flatMap((_, copyIdx) =>
    testimonials.map((item, idx) => ({
      item,
      _key: `${copyIdx}-${item.id ?? idx}`,
      _isMeasureTarget: copyIdx === 1 && idx === 0,
    }))
  );

  if (loading) return <BeautyLoversSkeleton />;

  if (testimonials.length === 0) return null;

  return (
    <section className="px-4 flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#333333] mb-8 md:mb-10 tracking-wide">
        BeautyLovers Speak
      </h2>

      {/* Sliding Track */}
      <div
        className="relative max-w-6xl w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden py-4">
          <motion.div
            ref={trackRef}
            className="flex gap-6 cursor-grab active:cursor-grabbing select-none"
            style={{ x, willChange: 'transform' }}
            drag="x"
            dragMomentum={false}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClickCapture={blockClickAfterDrag}
          >
            {repeated.map(({ item, _key, _isMeasureTarget }) => (
              <div
                key={_key}
                ref={_isMeasureTarget ? firstCardRef : null}
                className="flex-shrink-0 w-[300px] sm:w-[320px]"
              >
                <TestimonialCard item={item} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-colors focus:outline-none z-10"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-pink-300 shadow-md flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-colors focus:outline-none z-10"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}