import React from 'react';

// Static Data Array of Objects
const brandsData = [
  {
    id: 1,
    name: 'Brand 1',
    logoUrl: '/products/brand-1.jpg', 
    link: '#',
  },
  {
    id: 2,
    name: 'Brand 2',
    logoUrl: 'products/brand-2.jpg',
    link: '#',
  },
  {
    id: 3,
    name: 'Brand 3',
    logoUrl: 'products/brand-3.jpg',
    link: '#',
  },
  {
    id: 4,
    name: 'Brand 4',
    logoUrl: 'products/brand-4.jpg',
    link: '#',
  },
  {
    id: 5,
    name: 'Brand 5',
    logoUrl: 'products/brand-5.jpg',
    link: '#',
  },
  {
    id: 6,
    name: 'Brand 6',
    logoUrl: 'products/brand-6.jpg',
    link: '#',
  },
];

export default function TopBrands() {
  return (
    <section className="w-full py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-center font-bold text-lg md:text-xl text-[#222222] tracking-wider uppercase mb-6">
          TOP BRANDS
        </h2>

        {/* Dynamic Horizontal Image Grid Container */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {brandsData.map((brand) => (
            <a
              key={brand.id}
              href={brand.link}
              className="block w-full overflow-hidden bg-[#E5E7EB] hover:opacity-90 transition-opacity"
            >
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="w-full h-24 sm:h-28 md:h-32 object-cover block"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}