import { useSelector } from 'react-redux';

const useCart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { totalQty, totalPrice } = cartItems.reduce(
    (a, c) => {
      a.totalQty += c.qty;
      a.totalPrice = a.totalPrice + c.price * c.qty;
      return a;
    },
    { totalQty: 0, totalPrice: 0 }
  );

  return { totalQty, totalPrice };
};

export default useCart;
