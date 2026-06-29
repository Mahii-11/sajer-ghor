import React from 'react';

const BRAND_OFFERS_DATA = [
  {
    id: 'brand-1',
    image: 'images/top-1.jpg',
    alt: 'The Only Trimmer You Will Ever Need - Sleek electric trimmer under magenta glow',
  },
  {
    id: 'brand-2',
    image: 'images/top-2.jpg',
    alt: 'SkinO Summer Perfect Protection - Up to 50% Off sunscreens and skincare lotions',
  },
  {
    id: 'brand-3',
    image: 'images/top-3.jpg',
    alt: 'Introducing Vatika Naturals - Herbal and organic hair care with pure green ingredients',
  },
  {
    id: 'brand-4',
    image: 'images/top-4.jpg',
    alt: 'Treasure of Glow - Up to 35% Off and Free Delivery on Cetaphil and Simple skincare sets',
  },
  {
    id: 'brand-5',
    image: 'images/top-5.jpg',
    alt: 'The Ordinary - Up to 33% Off on clean clinical serum dropper bottles',
  },
  {
    id: 'brand-6',
    image: 'images/top-6.jpg',
    alt: 'Strong Vibe Hair Wash - Pink and yellow shampoo bottles with lemon and rose accents',
  },
];

export default function TopBrandsSection() {
  return (
    <section className="py-8" id="top-brands-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-center font-bold text-gray-900 tracking-wide uppercase text-lg md:text-xl mb-6">
          TOP BRANDS & OFFERS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {BRAND_OFFERS_DATA.map((brand) => (
            <div
              key={brand.id}
              className="group overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
              id={brand.id}
            >
              <img
                src={brand.image}
                alt={brand.alt}
                className="w-full h-auto aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}