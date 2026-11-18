import { Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getWishlist, removeFromWishlist } from "../../cart/wishlistSlice";

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(getWishlist);
  const count = wishlistItems.length;

  const clearAll = () => wishlistItems.forEach((item) => dispatch(removeFromWishlist(item)));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3">
            My Wishlist
            {count > 0 && (
              <span className="text-sm font-semibold px-2.5 py-1 rounded-full bg-[#db2777]/10 text-[#db2777]">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1">Products you've saved to buy later.</p>
        </div>

        {count > 0 && (
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {count === 0 ? (
        <div className="flex flex-col items-center text-center py-20 px-6 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-20 h-20 rounded-full bg-[#db2777]/10 flex items-center justify-center mb-5">
            <Heart className="w-9 h-9 text-[#db2777]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            Tap the heart on any product to save it here and find it again later.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#db2777] text-white text-sm font-semibold hover:bg-[#be185d] shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1500px]:grid-cols-5 gap-4">
          {wishlistItems.map((item) => {
            const variant = [item.variation_size, item.color_name].filter(Boolean).join(" · ");
            const goToProduct = () => navigate(`/product-details/${item.product_slug}`);

            return (
              <div
                key={item.product_slug}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Image */}
                <div
                  onClick={goToProduct}
                  className="relative aspect-square bg-slate-50 cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFromWishlist(item));
                    }}
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-[#db2777] hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col flex-1">
                  <h3
                    onClick={goToProduct}
                    className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem] leading-snug cursor-pointer hover:text-[#db2777] transition-colors"
                  >
                    {item.product_name}
                  </h3>
                  {variant && (
                    <p className="mt-1.5 inline-block w-fit text-xs font-medium text-slate-500 bg-slate-100 rounded-md px-2 py-0.5">
                      {variant}
                    </p>
                  )}

                  <div className="flex flex-col gap-2.5 mt-auto pt-3">
                    <p className="text-xl font-bold text-slate-900">
                      ৳{Number(item.discount_price || 0).toLocaleString()}
                    </p>
                    <button
                      onClick={goToProduct}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[#db2777] text-white text-sm font-semibold hover:bg-[#be185d] transition-colors"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
