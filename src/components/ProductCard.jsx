import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const { id, image, name, brand, price, oldPrice, rating, reviews, badge } = product;

  // Calculate discount percentage
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div 
      id={`product-card-${id}`}
      className="glass rounded-2xl border border-white/40 hover:border-[#db2777]/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full"
    >
      {/* Product Image and Badge */}
      <div className="relative aspect-square overflow-hidden bg-pink-50/30 flex items-center justify-center p-4">
        <img 
          src={image} 
          alt={name}
          referrerPolicy="no-referrer"
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Promotional Badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-[#db2777] text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            {badge}
          </span>
        )}

        {/* Instant discount tag if old price exists */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            -{discount}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
          {brand}
        </span>
        
        {/* Title */}
        <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 hover:text-[#db2777] transition-colors duration-200 mb-2 h-10 overflow-hidden leading-tight">
          {name}
        </h3>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 fill-current ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 font-medium">({reviews})</span>
        </div>

        {/* Pricing and Action */}
        <div className="mt-auto pt-3 border-t border-pink-100/30 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-gray-900">৳{price.toLocaleString()}</span>
              {oldPrice && (
                <span className="text-[10px] text-gray-400 line-through">৳{oldPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <button
            id={`btn-add-to-cart-${id}`}
            onClick={(e) => {
              e.preventDefault();
              if (onAddToCart) onAddToCart(product);
            }}
            className="bg-[#db2777] hover:bg-[#be185d] text-white p-2 rounded-full transition-all duration-300 group-hover:scale-105 active:scale-95 flex items-center justify-center shadow-md shadow-pink-100/50"
            title="Add to Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}