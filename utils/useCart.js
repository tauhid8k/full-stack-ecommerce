import { useSelector } from 'react-redux';

const useCart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const totalQty = cartItems.reduce((a, c) => a + c.qty, 0);

  return { totalQty };
};

export default useCart;
