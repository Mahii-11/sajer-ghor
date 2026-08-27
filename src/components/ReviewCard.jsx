import React from 'react';

export default function ReviewCard({ review }) {
  const { id, name, avatar, rating = 5, text, product } = review;

  return (
    <div 
      id={`review-card-${id}`}
      className="relative bg-white rounded-[24px] border border-[#E899B0] p-5 pt-14 text-center mt-12 flex flex-col justify-between max-w-[340px] w-full mx-auto"
    >
      {/* Top Floating Avatar */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 w-22 h-22 rounded-full border border-[#E899B0] bg-[#D9D9D9] overflow-hidden flex items-center justify-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-[#D9D9D9]" />
        )}
      </div>

      <div>
        {/* Customer Name */}
        <h3 className="text-sm font-extrabold text-[#222222] uppercase tracking-wide mb-1.5">
          {name}
        </h3>
        
        {/* Rating Stars */}
        <div className="flex justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-[#F59E0B]' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-[13px] text-[#333333] leading-relaxed font-normal mb-5 px-1">
          {text}
        </p>
      </div>

      {/* Recommended Product Section */}
      {product && (
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img 
              src={product.image} 
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 object-cover rounded bg-gray-100" 
            />
            <span className="text-[11px] text-[#444444] font-medium leading-tight text-left">
              {product.shortName || `${name?.split(' ')[0]} Recommends This Product`}
            </span>
          </div>
          
          <a 
            href={product.link || "#"} 
            className="text-[10px] font-bold text-[#E83E8C] whitespace-nowrap hover:underline tracking-tight"
          >
            SHOP NOW &gt;&gt;
          </a>
        </div>
      )}
    </div>
  );
}