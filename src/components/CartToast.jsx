import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X } from 'lucide-react';
import { getLastAdded, getTotalCartQuantity, openCartPopup } from '../cart/cartSlice';

const VISIBLE_MS = 3500;
const LEAVE_MS = 250;

let audioCtx = null;

// Soft two-note chime generated with the Web Audio API (no audio file needed).
function playChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    [[880, 0], [1318.5, 0.11]].forEach(([freq, delay]) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const t = audioCtx.currentTime + delay;

      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain).connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch {
    // Audio is a nice-to-have; ignore autoplay or device errors.
  }
}

export default function CartToast() {
  const dispatch = useDispatch();
  const lastAdded = useSelector(getLastAdded);
  const totalQuantity = useSelector(getTotalCartQuantity);

  const [toast, setToast] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const hideTimer = useRef(null);
  const removeTimer = useRef(null);

  const close = () => {
    clearTimeout(hideTimer.current);
    setLeaving(true);
    removeTimer.current = setTimeout(() => setToast(null), LEAVE_MS);
  };

  useEffect(() => {
    if (!lastAdded) return;

    clearTimeout(hideTimer.current);
    clearTimeout(removeTimer.current);
    setLeaving(false);
    setToast(lastAdded);
    playChime();

    hideTimer.current = setTimeout(close, VISIBLE_MS);
  }, [lastAdded?.nonce]);

  useEffect(() => () => {
    clearTimeout(hideTimer.current);
    clearTimeout(removeTimer.current);
  }, []);

  if (!toast || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed top-3 sm:top-5 left-0 right-0 z-[10000] flex justify-center px-3 pointer-events-none">
      <div
        key={toast.nonce}
        role="status"
        aria-live="polite"
        className={`pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(219,39,119,0.25)] ring-1 ring-pink-100 ${
          leaving ? 'cart-toast-out' : 'cart-toast-in'
        }`}
      >
        <div className="flex items-center gap-3 p-3 pr-10">
          <div className="relative shrink-0">
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                className="h-14 w-14 rounded-xl object-cover bg-gray-50 ring-1 ring-gray-100"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-pink-50" />
            )}
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900">Added to cart</p>
            <p className="truncate text-sm text-gray-600">{toast.name}</p>
            <p className="text-xs text-gray-400">
              Qty {toast.quantity} &middot; {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in cart
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              close();
              dispatch(openCartPopup());
            }}
            className="shrink-0 rounded-full bg-brand-pink px-3.5 py-2 text-xs font-semibold text-white hover:bg-brand-pink-hover transition-colors cursor-pointer"
          >
            View Cart
          </button>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div
          className="cart-toast-progress absolute bottom-0 left-0 h-0.5 w-full bg-brand-pink origin-left"
          style={{ animationDuration: `${VISIBLE_MS}ms` }}
        />
      </div>
    </div>,
    document.body
  );
}
