import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  showCartPopup: false,
  lastAdded: null,
};

const resolveUnitPrice = (item) => {
  if (item.selected_price) return Number(item.selected_price);
  if (item.offer_price) return Number(item.offer_price);
  if (item.price) return Number(item.price);
  if (item.min_price) return Number(item.min_price);
  return 0;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const newItem = action.payload;
      const quantityToAdd = newItem.quantity ?? 1;
      const unitPrice = resolveUnitPrice(newItem);
      
      const variantId = newItem.variant_id || newItem.selectedVariant?.id || 0;
      
      const sizeId = newItem.size_id || newItem.selectedSize?.id || newItem.size?.id || "";
      const colorId = newItem.color_id || newItem.selectedColor?.id || newItem.color?.id || "";
      const sizeName = newItem.selectedSize?.name || newItem.size?.name || newItem.size_name || "";
      const colorName = newItem.selectedColor?.name || newItem.color?.name || newItem.color_name || "";

      const existingItem = state.cart.find(
        (item) => item.slug === newItem.slug && item.variant_id === variantId
      );

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        state.cart.push({
          id: newItem.id,
          name: newItem.name,
          slug: newItem.slug,
          image: newItem.thumb_image || newItem.image || "",
          brand_name: typeof newItem.brand === "object" ? newItem.brand?.name : newItem.brand_name || "",
          unitPrice: unitPrice,
          quantity: quantityToAdd,
          totalPrice: quantityToAdd * unitPrice,
          has_variants: newItem.has_variants || false,
          variant_id: variantId,
          size_id: sizeId,
          color_id: colorId,
          size_name: sizeName,
          color_name: colorName,
        });
      }

      // Notify the global "added to cart" toast (skipped for Buy Now)
      if (!newItem.silent) {
        state.lastAdded = {
          nonce: (state.lastAdded?.nonce ?? 0) + 1,
          name: newItem.name,
          image: newItem.thumb_image || newItem.image || "",
          quantity: quantityToAdd,
        };
      }
    },

    deleteItem(state, action) {
      const payload = action.payload;
      if (typeof payload === "object") {
        const { slug, variant_id = 0 } = payload;
        state.cart = state.cart.filter(
          (item) => !(item.slug === slug && item.variant_id === variant_id)
        );
      } else {
        state.cart = state.cart.filter((item) => item.slug !== payload);
      }
    },

    increaseItemQuantity(state, action) {
      const payload = action.payload;
      const item = state.cart.find((item) =>
        typeof payload === "object"
          ? item.slug === payload.slug && item.variant_id === (payload.variant_id || 0)
          : item.slug === payload
      );

      if (item) {
        item.quantity += 1;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },

    decreaseItemQuantity(state, action) {
      const payload = action.payload;
      const item = state.cart.find((item) =>
        typeof payload === "object"
          ? item.slug === payload.slug && item.variant_id === (payload.variant_id || 0)
          : item.slug === payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        item.totalPrice = item.quantity * item.unitPrice;
      }
    },

    clearCart(state) {
      state.cart = [];
    },

    // Used to sync the cart from another browser tab
    replaceCart(state, action) {
      state.cart = Array.isArray(action.payload) ? action.payload : [];
    },

    // Drawer ওপেন এবং হাইড করার জন্য অ্যাকশন
    openCartPopup(state) {
      state.showCartPopup = true;
    },

    hideCartPopup(state) {
      state.showCartPopup = false;
    },
  },
});

export const {
  addItem,
  deleteItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  replaceCart,
  openCartPopup,
  hideCartPopup,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const getCart = (state) => state.cart?.cart ?? [];

export const getTotalCartQuantity = (state) =>
  state.cart?.cart?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;

export const getTotalCartPrice = (state) =>
  state.cart?.cart?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) ?? 0;

export const getShowCartPopup = (state) => state.cart?.showCartPopup ?? false;

export const getLastAdded = (state) => state.cart?.lastAdded ?? null;