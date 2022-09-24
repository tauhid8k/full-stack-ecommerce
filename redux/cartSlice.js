import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },

  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;

      // check if the item is already in cart
      const existItem = state.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      // If item is already in cart then increase only qty & price
      // Otherwise add new item to the cart
      if (existItem) {
        state.cartItems = state.cartItems.map((item) =>
          item.slug === existItem.slug ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        state.cartItems = [...state.cartItems, newItem];
      }
    },
    removeFromCart(state, action) {
      const slug = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.slug !== slug);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
