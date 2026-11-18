import { configureStore } from "@reduxjs/toolkit";
import cartReducer, { replaceCart } from "../cart/cartSlice";
import wishlistReducer, { replaceWishlist } from "../cart/wishlistSlice";

const CART_STORAGE_KEY = "shajerghor_cart_v1";
const WISHLIST_STORAGE_KEY = "shajerghor_wishlist_v1";

const parseWishlist = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item === "object" && item.product_slug)
      : [];
  } catch {
    return [];
  }
};

const readSavedWishlist = () => {
  try {
    return parseWishlist(localStorage.getItem(WISHLIST_STORAGE_KEY));
  } catch {
    return [];
  }
};

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
    wishlist: wishlistReducer,
  },
  // Restore the cart saved by a previous visit (refresh / reopened browser).
  preloadedState: {
    cart: {
      cart: readSavedCart(),
      showCartPopup: false,
      lastAdded: null,
    },
    wishlist: { items: readSavedWishlist() },
  },
});

// Save only the cart items / wishlist whenever they change.
let lastSaved = JSON.stringify(store.getState().cart.cart);
let lastSavedWishlist = JSON.stringify(store.getState().wishlist.items);
store.subscribe(() => {
  const nextWishlist = JSON.stringify(store.getState().wishlist.items);
  if (nextWishlist !== lastSavedWishlist) {
    lastSavedWishlist = nextWishlist;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, nextWishlist);
    } catch {
      // Storage blocked: wishlist still works for this session.
    }
  }

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
    if (e.key === WISHLIST_STORAGE_KEY) {
      const incomingWishlist = parseWishlist(e.newValue);
      const serializedWishlist = JSON.stringify(incomingWishlist);
      if (serializedWishlist === lastSavedWishlist) return;
      lastSavedWishlist = serializedWishlist;
      store.dispatch(replaceWishlist(incomingWishlist));
      return;
    }
    if (e.key !== CART_STORAGE_KEY) return;
    const incoming = parseCart(e.newValue);
    const serialized = JSON.stringify(incoming);
    if (serialized === lastSaved) return;
    lastSaved = serialized;
    store.dispatch(replaceCart(incoming));
  });
}

export default store;
