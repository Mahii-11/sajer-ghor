import { createSlice } from "@reduxjs/toolkit";

// Wishlist is kept entirely on the client (saved to localStorage by services/store.js).
// One entry per product (identified by product_slug).
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    addToWishlist(state, action) {
      const item = action.payload;
      if (!item?.product_slug) return;
      if (state.items.some((i) => i.product_slug === item.product_slug)) return;
      state.items.push(item);
    },

    // Accepts a wishlist item (or a plain slug)
    removeFromWishlist(state, action) {
      const slug =
        typeof action.payload === "object" ? action.payload.product_slug : action.payload;
      state.items = state.items.filter((i) => i.product_slug !== slug);
    },

    // Used to sync the wishlist from another browser tab
    replaceWishlist(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { addToWishlist, removeFromWishlist, replaceWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

// Selectors
export const getWishlist = (state) => state.wishlist?.items ?? [];

export const isInWishlist = (slug) => (state) =>
  !!slug && (state.wishlist?.items ?? []).some((i) => i.product_slug === slug);
