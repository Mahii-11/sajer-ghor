import { useEffect, useRef, useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, PauseCircle, Undo2 } from "lucide-react";
import { trackOrderApi } from "../../services/api";
import { resolveImageUrl } from "../../utils/imageUrl";

// Normal delivery flow (order_status: 0 → 1 → 2 → 3)
const STEPS = [
  { label: "Pending", icon: Clock },
  { label: "Processing", icon: Package },
  { label: "Courier", icon: Truck },
  { label: "Completed", icon: CheckCircle2 },
];

// Special statuses that are outside the normal flow
const SPECIAL = {
  4: { label: "Cancelled", icon: XCircle, cls: "bg-red-50 text-red-600 border-red-200", note: "This order has been cancelled." },
  5: { label: "On Hold", icon: PauseCircle, cls: "bg-amber-50 text-amber-700 border-amber-200", note: "This order is currently on hold." },
  6: { label: "Return", icon: Undo2, cls: "bg-slate-100 text-slate-700 border-slate-200", note: "This order has been returned." },
};

export const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    : "N/A";

const money = (n) => Number(n || 0).toLocaleString("en-US");

// "cash_on_delivery" -> "Cash On Delivery"
const humanize = (s) =>
  s ? String(s).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "N/A";

export function Stepper({ status }) {
  const special = SPECIAL[status];

  if (special) {
    const Icon = special.icon;
    return (
      <div className={`flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium ${special.cls}`}>
        <Icon className="w-4 h-4" /> {special.note}
      </div>
    );
  }

  const current = Math.min(Math.max(status, 0), STEPS.length - 1);

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className="absolute top-5 right-1/2 w-full h-0.5 -z-0"
                style={{ background: i <= current ? "var(--accent, #db2777)" : "#e2e8f0" }}
              />
            )}
            <div
              className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{
                background: done ? "var(--accent, #db2777)" : "#fff",
                borderColor: done ? "var(--accent, #db2777)" : "#e2e8f0",
                color: done ? "#fff" : "#94a3b8",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span
              className={`mt-2 text-xs sm:text-sm text-center ${
                done ? "font-semibold text-slate-900" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// accent: brand colour (public track page uses the storefront pink, dashboard keeps its orange)
// initialOrderId / initialPhone: pre-fill and auto-track (used by the thank-you page link)
export default function TrackOrder({ accent, initialOrderId = "", initialPhone = "" }) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const runTrack = async (rawId, rawPhone) => {
    // Order IDs look like "SGO-201114"; only strip an optional leading "#"
    const id = String(rawId).trim().replace(/^#/, "");
    if (!id || !String(rawPhone).trim()) {
      setError("Please enter both order ID and phone number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await trackOrderApi(id, rawPhone);
      // `data` is a single order object (older responses used an array)
      const data = res?.data;
      const list = Array.isArray(data) ? data : data && typeof data === "object" ? [data] : [];
      setOrders(res?.status ? list : []);
      if (!res?.status) setError(res?.message || "");
    } catch (err) {
      console.error("Track order failed:", err);
      setOrders([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    runTrack(orderId, phone);
  };

  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current || !initialOrderId || !initialPhone) return;
    autoRan.current = true;
    runTrack(initialOrderId, initialPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputCls =
    "w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[var(--accent,#db2777)] focus:ring-4 focus:ring-[var(--accent,#db2777)]/10 transition-all";

  return (
    <div
      className="bg-white rounded-2xl border border-slate-200 p-6"
      style={accent ? { "--accent": accent } : undefined}
    >
      <div className="pb-4 mb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Track Your Order</h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter your order ID and phone number to see where your order is.
        </p>
      </div>

      <form onSubmit={handleTrack} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] mb-6">
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" className={inputCls} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className={inputCls} />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent,#db2777)] text-white font-semibold disabled:opacity-60"
        >
          <Search className="w-4 h-4" /> {loading ? "Tracking..." : "Track"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {searched && !loading && orders.length === 0 && (
        <div className="flex flex-col items-center text-center py-14">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Truck className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No order found</h3>
          <p className="text-sm text-slate-500 mt-1">Check the order ID and phone number and try again.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((o) => (
            <div key={o.order_id} className="border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                <div>
                  <p className="font-bold text-slate-900">#{o.order_id}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {[o.customer_name, o.shipping_method].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {humanize(o.payment_method)} · {Number(o.payment_status) === 1 ? "Paid" : "Unpaid"}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-slate-500">Placed on {formatDate(o.placed_at || o.order_date)}</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {o.order_status_text || SPECIAL[Number(o.order_status)]?.label || STEPS[Number(o.order_status)]?.label}
                  </p>
                </div>
              </div>

              <Stepper status={Number(o.order_status)} />

              {o.courier && (o.courier.name || o.courier.tracking_id || o.courier.status) && (
                <div className="mt-6 rounded-lg bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700 space-y-0.5">
                  {o.courier.name && <p>Courier: <span className="font-semibold">{o.courier.name}</span></p>}
                  {o.courier.tracking_id && <p>Tracking ID: <span className="font-semibold">{o.courier.tracking_id}</span></p>}
                  {o.courier.status && <p>Status: <span className="font-semibold">{humanize(o.courier.status)}</span></p>}
                </div>
              )}

              {Array.isArray(o.items) && o.items.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <ul className="divide-y divide-slate-100">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-3 py-3">
                        <img
                          src={resolveImageUrl(it.image)}
                          alt={it.name}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{it.name}</p>
                          {it.variation && <p className="text-xs text-slate-500">{it.variation}</p>}
                          <p className="text-xs text-slate-500">
                            {it.quantity} × ৳{money(it.unit_price)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          ৳{money(Number(it.quantity) * Number(it.unit_price))}
                        </p>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-3 pt-3 border-t border-slate-100 text-sm space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <dt>Shipping ({o.shipping_method})</dt>
                      <dd>৳{money(o.shipping_cost)}</dd>
                    </div>
                    {Number(o.discount) > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <dt>Discount</dt>
                        <dd>-৳{money(o.discount)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-900 text-base">
                      <dt>Total</dt>
                      <dd>৳{money(o.total_amount)}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
