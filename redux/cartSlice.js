import { createSlice } from '@reduxjs/toolkit';
import cookies from 'js-cookie';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cookies.get('cart') ? JSON.parse(cookies.get('cart')) : [],
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

      const cartItems = existItem
        ? state.cartItems.map((item) =>
            item.slug === existItem.slug ? { ...item, qty: item.qty + 1 } : item
          )
        : [...state.cartItems, newItem];
      cookies.set('cart', JSON.stringify(cartItems));
      state.cartItems = cartItems;
    },
    removeFromCart(state, action) {
      const slug = action.payload;
      const filteredItem = state.cartItems.filter((item) => item.slug !== slug);
      cookies.set('cart', JSON.stringify(filteredItem));
      state.cartItems = filteredItem;
    },
    updateCartQty(state, action) {
      const updateItem = action.payload;
      const updateCart = state.cartItems.map((item) =>
        item.slug === updateItem.slug ? { ...item, qty: updateItem.qty } : item
      );
      cookies.set('cart', JSON.stringify(updateCart));
      state.cartItems = updateCart;
    },
  },
});

export const { addToCart, removeFromCart, updateCartQty } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
