import React from 'react';

// Static Data Array of Objects
const testimonialsData = [
  {
    id: 1,
    name: 'SAHEBA AKHTER TONNI',
    avatarImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', // Add profile image URL here
    rating: 5,
    review:
      "I'm extremely satisfied with Shajer ghor. They always provide completely authentic products, and their delivery is impressively fast.",
    productImg: '/products/product-3.jpg',
    productText: 'Saheba Recommends This Product',
    shopUrl: '#',
  },
  {
    id: 2,
    name: 'SAHEBA AKHTER TONNI',
    avatarImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', 
    rating: 5,
    review:
      "I'm extremely satisfied with Shajer ghor. They always provide completely authentic products, and their delivery is impressively fast.",
    productImg: '/products/product-2.jpg',
    productText: 'Saheba Recommends This Product',
    shopUrl: '#',
  },
  {
    id: 3,
    name: 'SAHEBA AKHTER TONNI',
    avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop', 
    rating: 5,
    review:
      "I'm extremely satisfied with Shajer ghor. They always provide completely authentic products, and their delivery is impressively fast.",
    productImg: '/products/product-1.jpg',
    productText: 'Saheba Recommends This Product',
    shopUrl: '#',
  },
];

// Single Card Component (Accepts item props)
const TestimonialCard = ({ item }) => {
  return (
    <div className="relative pt-16 w-full max-w-[320px]">
      {/* Top Profile Avatar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border border-pink-300 bg-[#E3E3E3] z-10 overflow-hidden flex items-center justify-center">
        {item.avatarImg ? (
          <img
            src={item.avatarImg}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Card Content Box */}
      <div className="rounded-[24px] border border-pink-300 bg-white pt-20 pb-6 px-6 text-center shadow-sm flex flex-col justify-between min-h-[360px]">
        <div>
          {/* User Name */}
          <h3 className="font-extrabold text-[#222222] text-lg tracking-wide mb-3">
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
          <div className="w-10 h-12 bg-amber-100 rounded border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={item.productImg}
              alt="Recommended Product"
              className="w-full h-full object-cover"
            />
          </div>

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

// Main Section Component
export default function BeautyLoversSection() {
  return (
    <section className="py-12 px-4 bg-white flex flex-col items-center min-h-screen">
      {/* Heading */}
      <h2 className="text-xl md:text-2xl font-bold text-[#333333] mb-8 tracking-tight">
        #BeautyLovers Speak
      </h2>

      {/* Mapping over static Array */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full justify-items-center">
        {testimonialsData.map((item) => (
          <TestimonialCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}