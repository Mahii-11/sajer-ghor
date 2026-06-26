import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review }) {
  const { id, name, avatar, rating, text, product } = review;

  return (
    <div 
      id={`review-card-${id}`}
      className="relative glass rounded-3xl p-6 pt-12 text-center shadow-lg hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 mt-10 h-full flex flex-col justify-between border border-white/40"
    >
      {/* Overflowing Avatar */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white shadow-md bg-white/85 backdrop-blur-md overflow-hidden">
        <img 
          src={avatar} 
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Customer Name & Stars */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
          {name}
        </h4>
        
        {/* Rating Stars */}
        <div className="flex justify-center text-amber-400 gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3.5 h-3.5 fill-current ${i < rating ? 'text-amber-400' : 'text-gray-200'}`} 
            />
          ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-xs text-gray-600 leading-relaxed italic mb-4 line-clamp-4">
          "{text}"
        </p>
      </div>

      {/* Purchased Product Thumbnail */}
      {product && (
        <div className="mt-4 pt-3 border-t border-white/30 flex items-center gap-3 bg-white/40 backdrop-blur-sm p-2 rounded-xl text-left">
          <img 
            src={product.image} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 object-cover rounded-lg border border-pink-100 bg-white" 
          />
          <div className="overflow-hidden">
            <span className="text-[9px] uppercase font-bold text-[#db2777] block">Purchased Item</span>
            <span className="text-[11px] text-gray-800 font-semibold truncate block">{product.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
