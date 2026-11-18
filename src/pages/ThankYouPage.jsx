import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, Truck, ShoppingBag, PhoneCall } from "lucide-react";

// Only the customer-facing `order_id` works with track-order (not the database `id`),
// so search the whole response for it instead of guessing one fixed path.
const findOrderId = (value, depth = 0) => {
  if (!value || typeof value !== "object" || depth > 4) return null;
  if (value.order_id !== undefined && value.order_id !== null && value.order_id !== "") {
    return value.order_id;
  }
  for (const child of Object.values(value)) {
    const found = findOrderId(child, depth + 1);
    if (found !== null) return found;
  }
  return null;
};

export default function ThankYouPage() {
  const { state } = useLocation();

  // Opened directly (no order just placed) -> nothing to thank for
  if (!state?.order) return <Navigate to="/" replace />;

  const orderId = findOrderId(state.order);
  const phone = state.phone || "";
  const trackUrl = orderId
    ? `/track-order?${new URLSearchParams({ order_id: orderId, phone }).toString()}`
    : "/track-order";

  return (
    <div className="bg-gray-50 pt-6 md:pt-10 pb-12 md:pb-20 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_-20px_rgba(219,39,119,0.35)] border border-pink-100 px-6 sm:px-10 py-10 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-pink-50 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-14 h-14 text-[#db2777]" strokeWidth={1.75} />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">Thank You for Your Order!</h1>
        <p className="mt-3 text-gray-500 leading-relaxed">
          Your order has been placed successfully. Our team will contact you shortly to confirm the
          order details.
        </p>

        {orderId && (
          <div className="mt-7 rounded-2xl border border-pink-100 bg-pink-50/50 py-4">
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="text-2xl font-black text-[#db2777] mt-0.5">#{orderId}</p>
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <PhoneCall className="w-4 h-4" /> You will receive a confirmation call soon. Please keep
          your phone available.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-[#db2777] hover:bg-[#be185d] text-white font-bold transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          <Link
            to={trackUrl}
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl border border-gray-200 text-gray-800 font-semibold hover:border-[#db2777] hover:text-[#db2777] transition-colors"
          >
            <Truck className="w-4 h-4" /> Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
