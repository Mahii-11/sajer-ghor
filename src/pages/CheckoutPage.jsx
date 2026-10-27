import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  User,
  Truck,
  Minus,
  Plus,
  Trash2,
  Lock,
  ShieldCheck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Loader2,
  X,
} from "lucide-react";
import {
  getCart,
  getTotalCartPrice,
  getTotalCartQuantity,
  increaseItemQuantity,
  decreaseItemQuantity,
  deleteItem,
  clearCart,
} from "../cart/cartSlice"; 
import { createOrder } from "../services/api"; // আপনার API ফাইলের সঠিক পাথ দিন

/* ------------------------------------------------------------------ */
/* Data                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Shipping & Payment" },
  { id: 3, label: "Confirmation" },
];

const SHIPPING_METHODS = [
  {
    id: "21", // API Postman অনুযায়ী numeric ID ব্যবহার করা হয়েছে
    name: "Inside Dhaka",
    note: "Delivery in 24-48 hours",
    price: 70,
  },
  {
    id: "22",
    name: "Outside Dhaka",
    note: "Delivery in 3-5 days",
    price: 130,
  },
  
];

/* ------------------------------------------------------------------ */
/* Modern Popup (replaces alert())                                    */
/* ------------------------------------------------------------------ */

function OrderPopup({ popup, onClose }) {
  if (!popup) return null;

  const isSuccess = popup.type === "success";

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-[fadeIn_0.15s_ease-out]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-white p-7 text-center shadow-2xl animate-[popIn_0.2s_ease-out]"
      >
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
          }`}
        >
          {isSuccess ? <Check size={28} /> : <X size={28} />}
        </div>

        <h3 className="mb-1.5 text-lg font-bold text-gray-900">
          {isSuccess ? "Order Placed!" : "Something Went Wrong"}
        </h3>

        <p className="mb-6 text-[13.5px] leading-relaxed text-gray-500">
          {popup.message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors cursor-pointer ${
            isSuccess
              ? "bg-[#E61C5C] hover:bg-pink-600"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {isSuccess ? "Continue" : "OK"}
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step indicator                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ currentStep }) {
  return (
    <div className="mb-6 sm:mb-10 flex items-center justify-center gap-1.5 sm:gap-3">
      {STEPS.map((step, idx) => {
        const isDone = step.id < currentStep;
        const isActive = step.id === currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? "bg-[#E61C5C] text-white"
                    : isActive
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isDone ? <Check size={14} /> : step.id}
              </div>
              <span
                className={`${isActive ? "inline" : "hidden sm:inline"} text-xs sm:text-sm font-medium ${
                  isActive
                    ? "text-gray-900"
                    : isDone
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-6 sm:w-16 ${
                  step.id < currentStep ? "bg-[#E61C5C]" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact & delivery details                                         */
/* ------------------------------------------------------------------ */

function ContactDetailsCard({ form, setForm, errors }) {
  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-[#E61C5C]">
          <User size={16} />
        </span>
        <h2 className="text-[15px] font-semibold text-gray-900">
          Contact &amp; Delivery Details
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-gray-800">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={update("fullName")}
            placeholder="e.g. full name"
            className={`w-full rounded-lg border ${
              errors.fullName ? "border-red-500 bg-red-50/20" : "border-gray-200 bg-gray-50"
            } px-3.5 py-3 sm:py-2.5 text-base sm:text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-gray-800">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="01XXXXXXXXX"
            className={`w-full rounded-lg border ${
              errors.phone ? "border-red-500 bg-red-50/20" : "border-gray-200 bg-gray-50"
            } px-3.5 py-3 sm:py-2.5 text-base sm:text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[13px] font-semibold text-gray-800">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            value={form.address}
            onChange={update("address")}
            placeholder="House, road, block, landmark"
            className={`w-full resize-none rounded-lg border ${
              errors.address ? "border-red-500 bg-red-50/20" : "border-gray-200 bg-gray-50"
            } px-3.5 py-3 sm:py-2.5 text-base sm:text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-pink-400 focus:bg-white focus:outline-none`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shipping method                                                    */
/* ------------------------------------------------------------------ */

function ShippingMethodCard({ selected, onSelect }) {
  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-[#E61C5C]">
          <Truck size={16} />
        </span>
        <h2 className="text-[15px] font-semibold text-gray-900">
          Shipping Method
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {SHIPPING_METHODS.map((method) => {
          const isActive = selected === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 sm:px-4 py-3.5 text-left transition-colors cursor-pointer ${
                isActive
                  ? "border-[#E61C5C] bg-pink-50/60"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-[#E61C5C] text-white"
                      : "bg-pink-50 text-[#E61C5C]"
                  }`}
                >
                  <Truck size={15} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-gray-900">
                    {method.name}
                  </p>
                  <p className="text-[12px] text-gray-400">{method.note}</p>
                </div>
              </div>
              <span className="text-[14px] font-semibold text-gray-800">
                ৳ {method.price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Order summary                                                      */
/* ------------------------------------------------------------------ */

function OrderSummaryCard({ shippingCost, promoCode, setPromoCode, onSubmit, loading }) {
  const dispatch = useDispatch();
  const cart = useSelector(getCart) || [];
  const subtotal = useSelector(getTotalCartPrice) || 0;
  const totalQuantity = useSelector(getTotalCartQuantity) || 0;
  const total = subtotal + shippingCost;

  const handleIncrease = (item) => {
    dispatch(increaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }));
  };

  const handleDecrease = (item) => {
    dispatch(decreaseItemQuantity({ slug: item.slug, variant_id: item.variant_id }));
  };

  const handleRemove = (item) => {
    dispatch(deleteItem({ slug: item.slug, variant_id: item.variant_id }));
  };

  return (
    <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-gray-900">Order Summary</h2>
        <span className="rounded-full bg-pink-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#E61C5C]">
          {totalQuantity} {totalQuantity > 1 ? "items" : "item"}
        </span>
      </div>

      <div className="mb-5 max-h-72 sm:max-h-80 overflow-y-auto space-y-4 pr-1">
        {cart.map((item, idx) => {
          const itemPrice = Number(item.unitPrice || 0);
          const variantText = [item.size_name, item.color_name].filter(Boolean).join(" · ");

          return (
            <div key={`${item.slug || idx}-${item.variant_id || idx}`} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="h-16 w-16 sm:h-14 sm:w-14 shrink-0 rounded-lg object-cover border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-gray-900 line-clamp-2 break-words">
                    {item.name}
                  </p>
                  <p className="whitespace-nowrap text-[13px] font-semibold text-gray-900">
                    ৳ {(itemPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
                {variantText && (
                  <p className="mb-1.5 text-[11px] text-gray-400 truncate">{variantText}</p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-2 rounded-full border border-gray-200 px-1.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => handleDecrease(item)}
                      className="flex h-5 w-5 items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-4 text-center text-[12px] font-medium text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(item)}
                      className="flex h-5 w-5 items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="text-gray-300 hover:text-[#E61C5C] transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    

      <div className="space-y-2 border-t border-gray-100 pt-4 text-[13px]">
        <div className="flex items-center justify-between text-gray-500">
          <span>Subtotal</span>
          <span>৳ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span>Shipping</span>
          <span>৳ {shippingCost.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[15px] font-semibold text-gray-900">Total</span>
        <span className="text-[17px] font-extrabold text-[#E61C5C]">
          ৳ {total.toFixed(2)}
        </span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#E61C5C] py-4 sm:py-3.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-pink-600 disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Lock size={15} /> Place Order
          </>
        )}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
        <ShieldCheck size={13} /> Your information is safe &amp; encrypted
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <Zap size={13} className="text-[#E61C5C]" /> 100% Genuine
        </span>
        <span className="flex items-center gap-1.5">
          <RotateCcw size={13} className="text-[#E61C5C]" /> Easy Returns
        </span>
        <span className="flex items-center gap-1.5">
          <Truck size={13} className="text-[#E61C5C]" /> Fast Delivery
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(getCart) || [];

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
   
  });
  const [shippingMethod, setShippingMethod] = useState("21");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null); // { type: "success" | "error", message: string }

  // Buy Now korle user jekhane thakuk, smooth vabe uporer dike niye jabe
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const shippingCost =
    SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0;

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.fullName);
      formData.append("phone", form.phone);
      formData.address = form.address;
      formData.append("address", form.address);
      formData.append("shipping_method", shippingMethod);

      // cartSlice এর নতুন ফিল্ড অনুযায়ী ডাটা অ্যাপেন্ড করা হচ্ছে
      cart.forEach((item, index) => {
        formData.append(`items[${index}][product_id]`, item.id);
        // Cart uses a "size-color" key as variant_id; the API only knows size_id/color_id
        formData.append(`items[${index}][variant_id]`, Number.isInteger(item.variant_id) ? item.variant_id || "" : "");
        formData.append(`items[${index}][size_id]`, item.size_id || "");
        formData.append(`items[${index}][color_id]`, item.color_id || "");
        formData.append(`items[${index}][image]`, item.image || "");
        formData.append(`items[${index}][price]`, item.unitPrice);
        formData.append(`items[${index}][qty]`, item.quantity);
      });

      const result = await createOrder(formData);

      if (result && (result.status || result.success || result.id)) {
        dispatch(clearCart());
        setPopup({
          type: "success",
          message: "Order placed successfully!",
          orderResult: result,
        });
      } else {
        setPopup({
          type: "error",
          message:
            result?.msg || result?.message || result?.error || "Failed to place order.",
        });
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setPopup({
        type: "error",
        message: "Something went wrong while placing the order.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    const wasSuccess = popup?.type === "success";
    const orderResult = popup?.orderResult;
    setPopup(null);
    if (wasSuccess) {
      navigate("/", { state: { order: orderResult } });
    }
  };


  if (cart.length === 0) {
    return (
      <>
        <div className="min-h-screen  flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-md">
            <div className="w-16 h-16 bg-pink-50 text-[#E61C5C] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-gray-500 mb-6">
              You have no items in your shopping cart. Add some products to proceed with checkout.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center bg-[#E61C5C] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-pink-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Cart order success hole clearCart() er por cart.length 0 hoye jay,
            tai popup ta ei branch e o render korte hocche */}
        <OrderPopup popup={popup} onClose={handleClosePopup} />
      </>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4">
        <StepIndicator currentStep={2} />

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-2">
            <ContactDetailsCard form={form} setForm={setForm} errors={errors} />
            <ShippingMethodCard
              selected={shippingMethod}
              onSelect={setShippingMethod}
            />
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:self-start">
            <OrderSummaryCard
              shippingCost={shippingCost}
              onSubmit={handlePlaceOrder}
              loading={loading}
            />
          </div>
        </form>
      </div>

      <OrderPopup popup={popup} onClose={handleClosePopup} />
    </div>
  );
}