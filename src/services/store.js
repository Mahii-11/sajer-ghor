import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart } from "../cart/cartSlice";

const CART_STORAGE_KEY = "shajerghor_cart_v1";

const parseCart = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item === "object" && item.slug)
      : [];
  } catch {
    return [];
  }
};

const readSavedCart = () => {
  try {
    return parseCart(localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    return [];
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // Restore the cart saved by a previous visit (refresh / reopened browser).
  preloadedState: {
    cart: {
      cart: readSavedCart(),
      showCartPopup: false,
      lastAdded: null,
    },
  },
});

// Save only the cart items whenever they change.
let lastSaved = JSON.stringify(store.getState().cart.cart);
store.subscribe(() => {
  const next = JSON.stringify(store.getState().cart.cart);
  if (next === lastSaved) return;
  lastSaved = next;
  try {
    localStorage.setItem(CART_STORAGE_KEY, next);
  } catch {
    // Storage full or blocked (private mode): the cart still works for this session.
  }
});

// Keep several open tabs in sync with each other.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== CART_STORAGE_KEY) return;
    const incoming = parseCart(e.newValue);
    const serialized = JSON.stringify(incoming);
    if (serialized === lastSaved) return;
    lastSaved = serialized;
    store.dispatch(replaceCart(incoming));
  });
}

export default store;
