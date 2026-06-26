import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  {
    id: 1,
    image: "/images/heroImage-3.jpg",
  },
  {
    id: 2,
    image: "/images/heroImage-2.jpg",
  },
  {
    id: 3,
    image: "/images/heroImage-1.jpg",
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  const startSlideTimer = () => {
    stopSlideTimer();
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
  };

  const stopSlideTimer = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  useEffect(() => {
    startSlideTimer();
    return () => stopSlideTimer();
  }, []);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
    startSlideTimer();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    startSlideTimer();
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    startSlideTimer();
  };

  return (
    <div
      id="hero-carousel"
      className="relative w-full overflow-hidden h-[150px] sm:h-[240px] md:h-[340px] lg:h-[400px] xl:h-[460px] group "
    >
      {/* Slides Wrapper */}
      <div
        className="flex h-full w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-full w-full shrink-0 overflow-hidden"
          >
            <img
              src={banner.image}
              alt={`Banner ${banner.id}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Prev/Next Buttons (Subtle on hover for perfect UX) */}
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

      {/* Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 bg-black/10 backdrop-blur-xs px-3 py-1.5 rounded-full">
        {banners.map((_, index) => (
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
    </div>
  );
}
