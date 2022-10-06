import { createSlice } from '@reduxjs/toolkit';
import cookies from 'js-cookie';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: cookies.get('cart')
      ? JSON.parse(cookies.get('cart')).cartItems
      : [],
    shippingAddress: cookies.get('cart')
      ? JSON.parse(cookies.get('cart')).shippingAddress
      : {},
    paymentMethod: cookies.get('cart')
      ? JSON.parse(cookies.get('cart')).paymentMethod
      : 0,
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
      cookies.set('cart', JSON.stringify({ cartItems }));
      state.cartItems = cartItems;
    },
    removeFromCart(state, action) {
      const slug = action.payload;
      const filteredItem = state.cartItems.filter((item) => item.slug !== slug);
      cookies.set('cart', JSON.stringify({ cartItems: filteredItem }));
      state.cartItems = filteredItem;
    },
    updateCartQty(state, action) {
      const updateItem = action.payload;
      const updateCart = state.cartItems.map((item) =>
        item.slug === updateItem.slug ? { ...item, qty: updateItem.qty } : item
      );
      cookies.set('cart', JSON.stringify({ cartItems: updateCart }));
      state.cartItems = updateCart;
    },
    resetCart(state) {
      state.cartItems = [];
    },
    saveShippingAddress(state, action) {
      state.shippingAddress = action.payload;
    },
    setPaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQty,
  resetCart,
  saveShippingAddress,
  setPaymentMethod,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
