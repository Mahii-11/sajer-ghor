import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSliders } from '../services/api';

export default function HeroBanner() {
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    const loadSlider = async () => {
      try {
        setLoading(true);
        const data = await getSliders();
        if (Array.isArray(data)) {
          setSlider(data);
        }
      } catch (error) {
        console.error("Error fetching Hero Slider data", error);
      } finally {
        setLoading(false);
      }
    };

    loadSlider();
  }, []);

  const startSlideTimer = () => {
    stopSlideTimer();
    if (slider.length <= 1) return;

    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slider.length);
    }, 5000);
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    if (slider.length > 1) {
      startSlideTimer();
    }
    return () => stopSlideTimer();
  }, [slider.length]);

  const handleNext = () => {
    if (slider.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slider.length);
    startSlideTimer();
  };

  const handlePrev = () => {
    if (slider.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slider.length) % slider.length);
    startSlideTimer();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startSlideTimer();
  };

  // Modern Skeleton Loader State
  if (loading) {
    return (
      <div className="relative w-full overflow-hidden h-[150px] sm:h-[240px] md:h-[340px] lg:h-[400px] xl:h-[460px] bg-slate-200/70">
        <style>{`
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}</style>
        
        {/* Shimmer Light Effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        {/* Fake Banner Content Placeholder */}
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 space-y-3">
          <div className="h-4 sm:h-6 md:h-8 w-1/3 bg-slate-300/80 rounded-md animate-pulse" />
          <div className="h-3 sm:h-4 md:h-5 w-1/2 bg-slate-300/60 rounded-md animate-pulse" />
        </div>

        {/* Fake Arrow Buttons Placeholder */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-300/70 hidden sm:block animate-pulse" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-300/70 hidden sm:block animate-pulse" />

        {/* Fake Dots Indicator Placeholder */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-300/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
          <div className="h-2 w-6 rounded-full bg-[#db2777]/50 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!slider || slider.length === 0) return null;

  return (
    <div
      id="hero-carousel"
      className="relative w-full overflow-hidden h-[150px] sm:h-[240px] md:h-[340px] lg:h-[400px] xl:h-[460px] group"
    >
      {/* Slides Wrapper */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slider.map((banner) => (
          <div
            key={banner.id}
            className="relative h-full w-full shrink-0 overflow-hidden"
          >
            <picture>
              {banner.mobile_image && (
                <source media="(max-width: 639px)" srcSet={banner.mobile_image} />
              )}
              <img
                src={banner.image}
                alt={`Banner ${banner.id}`}
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </div>
        ))}
      </div>

      {/* Prev/Next Buttons (disabled for now, uncomment to use)
      {slider.length > 1 && (
        <>
          <button
            id="btn-carousel-prev"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20 backdrop-blur-xs"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            id="btn-carousel-next"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20 backdrop-blur-xs"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}
      */}

      {/* Dots Indicator */}
      {slider.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 bg-black/10 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {slider.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                currentSlide === index
                  ? "h-2 w-6 rounded-full bg-[#db2777]"
                  : "h-2 w-2 rounded-full bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}