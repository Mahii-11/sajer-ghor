import React from 'react';

const DEALS_DATA = [
  {
    id: 'deal-1',
    image: '/images/deal-1.jpg',
    alt: 'Mega Offers - Up to 50% Off and Free Delivery on Hair Care and Cosmetics',
  },
  {
    id: 'deal-2',
    image: '/images/deal-2.jpg',
    alt: 'Naturale Shampoo - Organic Coconut and Aloe Vera Hair Care Special',
  },
  {
    id: 'deal-3',
    image: '/images/deal-3.jpg',
    alt: 'Buy 2 Get 101 Off - Premium Feminine Care & Hygiene Pads Special',
  },
  {
    id: 'deal-4',
    image: '/images/deal-4.jpg',
    alt: 'Ombre Fragrances - Luxury Perfume and Body Mist with Up to 16% Discount',
  },
];

export default function DealsSection() {
  return (
    <section className="py-8" id="deals-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-center font-bold text-gray-900 tracking-wide uppercase text-lg md:text-xl mb-6">
          DEALS YOU CANNOT MISS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {DEALS_DATA.map((deal) => (
            <div
              key={deal.id}
              className="group overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
              id={deal.id}
            >
              <img
                src={deal.image}
                alt={deal.alt}
                className="w-full h-auto aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}