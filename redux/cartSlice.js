import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    totalItemsCount: 0,
    totalUniqueItems: 0,
    totalPrice: 0,
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
        existItem.totalQtyPrice += newItem.price;
        state.totalPrice += newItem.price;
        state.totalItemsCount++;
      } else {
        state.cartItems.push({
          slug: newItem.slug,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          countInStock: newItem.countInStock,
          qty: newItem.qty,
          totalQtyPrice: newItem.price * newItem.qty,
        });
        state.totalPrice += newItem.price;
        state.totalItemsCount++;
        state.totalUniqueItems++;
      }
    },
    removeFromCart() {},
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
