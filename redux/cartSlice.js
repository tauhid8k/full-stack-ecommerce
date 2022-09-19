import { createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalItemsCount: 0,
    totalUniqueItems: 0,
  },

  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;

      // check if the item is already in cart (so only increase quantity & price)
      const existItem = state.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      if (existItem) {
        existItem.qty++;
        state.totalItemsCount++;
        existItem.totalPrice += newItem.price;
      } else {
        state.cartItems.push({
          slug: newItem.slug,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          countInStock: newItem.countInStock,
          qty: newItem.qty,
          totalPrice: newItem.price * newItem.qty,
        });
        state.totalItemsCount++;
        state.totalUniqueItems++;
      }
    },
    removeFromCart() {},
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
