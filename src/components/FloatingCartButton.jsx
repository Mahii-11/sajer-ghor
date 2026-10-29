import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import {
  getShowCartPopup,
  getTotalCartPrice,
  getTotalCartQuantity,
  openCartPopup,
} from '../cart/cartSlice';

export default function FloatingCartButton() {
  const dispatch = useDispatch();
  const quantity = useSelector(getTotalCartQuantity);
  const total = useSelector(getTotalCartPrice);
  const drawerOpen = useSelector(getShowCartPopup);

  if (quantity === 0 || drawerOpen) return null;

  return (
    <button
      id="floating-cart-button"
      type="button"
      onClick={() => dispatch(openCartPopup())}
      aria-label={`Open cart, ${quantity} items`}
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 w-[76px] cursor-pointer active:scale-95 transition-transform"
    >
      {/* key re-mounts the bag on every quantity change so the bounce replays */}
      <span
        key={quantity}
        className="flex flex-col items-center animate-bounce [animation-iteration-count:2] drop-shadow-xl"
      >
        {/* Bag handle */}
        <span className="block w-9 h-5 -mb-px border-[3px] border-b-0 border-gray-900 rounded-t-full" />
        {/* Bag body: dark top, pink bottom */}
        <span className="block w-full overflow-hidden rounded-t-md rounded-b-2xl">
          <span className="flex flex-col items-center gap-0.5 bg-gray-900 text-white py-2.5">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[11px] font-semibold">{quantity} ITEMS</span>
          </span>
          <span className="block bg-brand-pink text-white text-xs font-bold py-2 text-center">
            ৳{Math.round(total)}
          </span>
        </span>
      </span>
    </button>
  );
}
