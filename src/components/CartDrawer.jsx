import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import {
  getCart,
  getTotalCartQuantity,
  getTotalCartPrice,
  getShowCartPopup,
  hideCartPopup,
  increaseItemQuantity,
  decreaseItemQuantity,
  deleteItem,
} from '../cart/cartSlice'; 

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const cart = useSelector(getCart) || [];
  const cartOpen = useSelector(getShowCartPopup);
  const totalQuantity = useSelector(getTotalCartQuantity) || 0;
  const cartSubtotal = useSelector(getTotalCartPrice) || 0;

  if (!cartOpen) return null;

  // Handlers
  const handleClose = () => {
    dispatch(hideCartPopup());
  };

  const handleIncrease = (item) => {
    dispatch(increaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }));
  };

  const handleDecrease = (item) => {
    dispatch(decreaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }));
  };

  const handleRemove = (item) => {
    dispatch(deleteItem({ slug: item.slug, variant_id: item.variant_id }));
  };

  const handleCheckout = () => {
    dispatch(hideCartPopup());
    navigate('/checkout');
  };

  // Safe helper for brand string
  const getBrandString = (brand) => {
    if (typeof brand === 'string') return brand;
    if (typeof brand === 'object' && brand !== null) return brand.name || '';
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Backdrop / Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />
      
      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-full sm:w-96 md:max-w-md bg-white/95 backdrop-blur-xl shadow-2xl flex flex-col border-l border-white/40 h-full">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-white/60 backdrop-blur-md shrink-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
              Shopping Cart 
              <span className="bg-[#db2777] text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-black">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </h3>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
            {cart.length > 0 ? (
              cart.map((item, idx) => {
                const brandDisplay = getBrandString(item.brand_name || item.brand);
                const priceDisplay = Number(item.unitPrice || item.price || item.offer_price || 0);

                return (
                  <div 
                    key={`${item.slug || idx}-${item.variant_id || 0}-${idx}`} 
                    className="flex gap-3 sm:gap-4 p-3 border border-pink-100/60 rounded-2xl hover:border-pink-200 transition-colors bg-white/80 backdrop-blur-sm relative group shadow-xs items-center"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-pink-100 overflow-hidden bg-white shrink-0 flex items-center justify-center p-1">
                      <img 
                        src={item.image || '/placeholder.jpg'} 
                        alt={typeof item.name === 'string' ? item.name : 'Cart Item'}
                        referrerPolicy="no-referrer"
                        className="object-contain w-full h-full" 
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      {brandDisplay && (
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#db2777] block">
                          {brandDisplay}
                        </span>
                      )}
                      
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate leading-snug">
                        {typeof item.name === 'string' ? item.name : ''}
                      </h4>
                      
                      {/* Size & Color Variants */}
                      {(item.size_name || item.color_name) && (
                        <div className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5">
                          {item.size_name && <span>Size: {typeof item.size_name === 'object' ? item.size_name?.name : item.size_name}</span>}
                          {item.size_name && item.color_name && <span> | </span>}
                          {item.color_name && <span>Color: {typeof item.color_name === 'object' ? item.color_name?.name : item.color_name}</span>}
                        </div>
                      )}

                      <span className="text-xs sm:text-sm font-extrabold text-gray-900 block mt-1">
                        ৳{priceDisplay.toLocaleString()}
                      </span>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button 
                          onClick={() => handleDecrease(item)}
                          className="bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-[#db2777] p-1.5 rounded-md transition cursor-pointer active:scale-95"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-gray-800 min-w-[18px] text-center">
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => handleIncrease(item)}
                          className="bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-[#db2777] p-1.5 rounded-md transition cursor-pointer active:scale-95"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Remove item button */}
                    <button 
                      onClick={() => handleRemove(item)}
                      className="text-gray-400 hover:text-red-500 absolute top-2.5 right-2.5 p-1 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 sm:py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto text-[#db2777]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our best deals and categories to fill your vanity with 100% authentic international products.
                </p>
                <button 
                  onClick={handleClose}
                  className="bg-[#db2777] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer hover:bg-black transition"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Subtotal & Checkout Section */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-pink-100/60 bg-white/80 backdrop-blur-md space-y-3 sm:space-y-4 shrink-0">
              <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="text-gray-900 font-extrabold text-xs sm:text-sm">৳{Number(cartSubtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Standard Shipping</span>
                  <span className="text-emerald-600 font-bold text-xs">FREE (Promo)</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm font-black text-gray-900 pt-2 border-t border-dashed border-pink-200">
                  <span>Total (Incl. VAT)</span>
                  <span className="text-[#db2777] text-sm sm:text-base whitespace-nowrap">
                    ৳{Number(cartSubtotal).toLocaleString()} BDT
                  </span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#db2777] hover:bg-[#be185d] text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-2xl transition duration-300 shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}