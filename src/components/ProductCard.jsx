import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { FaBagShopping, FaCartPlus } from 'react-icons/fa6';

export default function ProductCard({ product, onAddToCart }) {
  const { id, image, name, brand, price, oldPrice, rating, reviews, badge } = product;

  // Calculate discount percentage
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div 
      id={`product-card-${id}`}
      className="relative bg-white border border-gray-200 rounded-[22px] overflow-hidden flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow"
    >
         <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute top-3 left-3 bg-[#FCF8F8] text-gray-950 text-[9px] sm:text-[10px] font-bold uppercase px-2.5 py-1 rounded-r-md rounded-l-sm z-10 shadow-sm">
          {product.brand}
        </div>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover block hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-gray-900 text-xs font-semibold line-clamp-1 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-black font-extrabold text-base sm:text-lg">
              ৳{product.price}
            </span>
            <span className="text-[#E61C5C] line-through text-xs font-semibold">
              ৳{product.oldPrice}
            </span>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="grid grid-cols-2 gap-1.5 w-full pt-1">
          {/* Buy Now Button */}
          <button 
            title="Buy Now"
            className="bg-[#E61C5C] hover:bg-pink-600 text-white font-medium py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors leading-tight cursor-pointer"
          >
            <FaBagShopping className="text-sm shrink-0" />
            <span className="hidden md:inline text-[10px] xl:text-[11px] whitespace-nowrap">
              Buy Now
            </span>
          </button>

          {/* Add to Cart Button border-[#4C127D] text-[#4C127D] */}
          <button 
            title="Add to Cart"
            className="bg-white border border-[#E61C5C] text-[#E61C5C] hover:bg-purple-50 font-medium py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-colors leading-tight"
          >
            <FaCartPlus className="text-sm shrink-0" />
            <span className="hidden md:inline text-[10px] xl:text-[11px] whitespace-nowrap">
              Add to Cart
            </span>
          </button>
        </div>
        </div>
    </div>
  );
}