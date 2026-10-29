import React from 'react';
import { FaBagShopping, FaCartPlus, FaStar } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem, hideCartPopup } from '../cart/cartSlice'; 

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API response object safe destructuring with fallbacks
  const {
    id,
    image,
    thumb_image,
    name,
    brand_name,
    brand,
    type,
    min_price,
    minPrice,
    max_price,
    maxPrice,
    price,
    offer_price,
    slug,
    // Static / Future dynamic fields
    rating = 4.5,
    reviews_count = 124,
    size = '50ml'
  } = product || {};

  // Resolve prices regardless of camelCase or snake_case
  const resolvedMinPrice = min_price ?? minPrice;
  const resolvedMaxPrice = max_price ?? maxPrice;
  
  // Check if product is variable
  const isVariable = type === 'variable' || type === 'variant' || (resolvedMinPrice !== undefined && resolvedMinPrice !== null);

  const displayImage = image || thumb_image || '';
  
  const displayBrand = typeof brand_name === 'string' 
    ? brand_name 
    : (typeof brand === 'object' ? brand?.name : (typeof brand === 'string' ? brand : ''));
  
  const displayPrice = offer_price || price;
  const oldPrice = offer_price ? price : null;

  // Discount percentage calculation
  const discountPercent = oldPrice && displayPrice 
    ? Math.round(((oldPrice - displayPrice) / oldPrice) * 100) 
    : null;

  // Safe rating calculation for 5-star percentage
  const currentRating = Math.min(5, Math.max(0, Number(rating) || 0));
  const fillPercentage = (currentRating / 5) * 100;

  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (isVariable) {
      navigate(`/product-details/${slug}`);
      return;
    }

    dispatch(
      addItem({
        id,
        name: typeof name === 'string' ? name : '',
        slug,
        image: displayImage,
        brand_name: displayBrand,
        price: Number(price || 0),
        offer_price: offer_price ? Number(offer_price) : null,
        unitPrice: Number(displayPrice || 0),
        quantity: 1,
      })
    );
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();

    if (isVariable) {
      navigate(`/product-details/${slug}`);
      return;
    }

    dispatch(
      addItem({
        id,
        name: typeof name === 'string' ? name : '',
        slug,
        image: displayImage,
        brand_name: displayBrand,
        price: Number(price || 0),
        offer_price: offer_price ? Number(offer_price) : null,
        unitPrice: Number(displayPrice || 0),
        quantity: 1,
        silent: true,
      })
    );
    dispatch(hideCartPopup());

    navigate('/checkout');
  };

  return (
    <div 
      id={`product-card-${id}`}
      onClick={() => navigate(`/product-details/${slug}`)}
      className="relative bg-white border border-gray-200 rounded-2xl sm:rounded-[22px] overflow-hidden flex flex-col justify-between w-full shadow-[0_4px_16px_rgba(230,28,92,0.10)] hover:shadow-[0_8px_24px_rgba(230,28,92,0.18)] active:scale-[0.98] transition-all duration-200 cursor-pointer"
    >
      {/* Discount Badge on Top Left */}
      {discountPercent && (
        <div className="absolute top-0 left-0 bg-linear-to-r from-[#E61C5C] to-[#ff5c8a] text-white text-xs font-bold px-2.5 py-1 rounded-br-xl shadow z-10">
          {discountPercent}% OFF
        </div>
      )}

      {/* Responsive Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        <img
          src={displayImage || '/placeholder.jpg'}
          alt={typeof name === 'string' ? name : 'Product Image'}
          className="w-full h-full object-cover block hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between text-center">
        <div className="flex flex-col gap-2 sm:gap-4">
          {/* Brand Name */}
          {displayBrand && (
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
              {displayBrand}
            </p>
          )}

          {/* Product Title */}
          <h3 className="text-gray-900 text-sm font-medium line-clamp-2 min-h-10 leading-snug">
            {typeof name === 'string' ? name : ''}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-center gap-3">
            {isVariable && resolvedMinPrice != null ? (
              <span className="text-[#E61C5C] font-bold text-base sm:text-lg">
                <span className="text-[1.3em] mr-0.5 leading-none font-semibold">৳</span>{resolvedMinPrice} {resolvedMaxPrice && resolvedMaxPrice !== resolvedMinPrice ? <>- <span className="text-[1.3em] mr-0.5 leading-none font-semibold">৳</span>{resolvedMaxPrice}</> : ''}
              </span>
            ) : (
              <>
                <span className="text-[#E61C5C] font-bold text-base sm:text-lg tracking-widest">
                  <span className="text-[1.3em] mr-0.5 leading-none font-semibold">৳</span>{displayPrice}
                </span>
                {oldPrice && (
                  <span className="text-gray-400 line-through text-sm font-medium tracking-wider">
                    <span className="text-[1.3em] mr-0.5 leading-none font-semibold">৳</span>{oldPrice}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Dynamic 5-Star Rating Section */}
          <div className="flex items-center justify-center gap-2.5">
            <div className="relative inline-flex items-center">
              {/* Background Empty Stars */}
              <div className="flex text-gray-200 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-xs sm:text-sm" />
                ))}
              </div>

              {/* Filled Stars Layer (Percentage Clipped) */}
              <div 
                className="absolute top-0 left-0 overflow-hidden h-full"
                style={{ width: `${fillPercentage}%` }}
              >
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-xs sm:text-sm shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Count */}
            <span className="text-xs font-medium text-gray-500 leading-none">
              ({reviews_count})
            </span>
          </div>

          {/* Size / Weight */}
          {size && (
            <div className='mt-0.5 sm:mt-1.5'>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full inline-block">
                {size}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full pt-3 sm:pt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            title="Add to Cart"
            className="bg-white border border-[#E61C5C] text-[#E61C5C] hover:bg-pink-50 font-medium py-2.5 sm:py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all active:scale-95 leading-tight cursor-pointer"
          >
            <FaCartPlus className="text-sm shrink-0" />
            <span className="text-xs font-semibold whitespace-nowrap">
              <span className="sm:hidden">Add</span>
              <span className="hidden sm:inline md:hidden lg:inline">Add to Cart</span>
            </span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            title="Buy Now"
            className="bg-linear-to-r from-[#E61C5C] to-[#f43f7a] hover:brightness-110 text-white font-medium py-2.5 sm:py-2 px-1 rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-1 transition-all active:scale-95 leading-tight cursor-pointer"
          >
            <FaBagShopping className="text-sm shrink-0" />
            <span className="text-xs font-semibold whitespace-nowrap">
              <span className="sm:hidden">Buy</span>
              <span className="hidden sm:inline md:hidden lg:inline">Buy Now</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}