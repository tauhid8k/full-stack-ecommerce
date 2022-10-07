import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Cart.module.css';
import { CheckoutWizard, Layout } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { resetCart } from '../redux/cartSlice';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useCart from '../utils/useCart';
import data from '../utils/data';
import cookies from 'js-cookie';
import axios from 'axios';

const PlaceOrderScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { totalQty, totalPrice } = useCart();
  const { cartItems, shippingAddress, paymentMethod } = useSelector(
    (state) => state.cart
  );

  const selectedPaymentMethod = data.paymentGateWays.find(
    (method) => method.id === paymentMethod
  );

  const roundCost = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = roundCost(totalPrice);
  const taxPrice = roundCost(itemsPrice & 0.15);
  const shippingPrice = itemsPrice > 200 ? 0 : 30;
  const totalDuePrice = roundCost(itemsPrice + taxPrice + shippingPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
  }, [router, paymentMethod]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: selectedPaymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: totalDuePrice,
      });
      setLoading(false);
      dispatch(resetCart());
      cookies.set(
        'cart',
        JSON.stringify({
          cartItems: [],
          shippingAddress,
          paymentMethod,
        })
      );
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(error.message, {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
    }
  };

  return (
    <>
      <Toaster />

      <Layout title="Place Order">
        <div className="mt-24 mb-8">
          <CheckoutWizard activeStep={3} />
        </div>
        {cartItems.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 p-5 rounded">
            <h4 className="text-medium flex gap-3 justify-center items-center">
              <span className="text-xl">Cart Is Empty</span>
              <Link href="/">
                <a className="text-purple-700 hover:underline">Go Shopping</a>
              </Link>
            </h4>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-4">
            <div className="md:col-span-3">
              <div className="bg-white py-3 px-4 rounded shadow-sm mb-5">
                <div className="border-b pb-3 mb-2">
                  <Link href="/shipping">
                    <a className="btn btn-light-danger">Edit</a>
                  </Link>
                </div>
                <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                <div className="text-md font-medium">
                  <span className="block">{shippingAddress.fullName}</span>
                  <span>
                    {shippingAddress.address},{shippingAddress.city},
                    {shippingAddress.postal}
                  </span>
                  <span className="block mb-1">{shippingAddress.mobile}</span>
                </div>
              </div>

              <div className="bg-white py-3 px-4 rounded shadow-sm mb-5">
                <div className="border-b pb-3 mb-2">
                  <Link href="/payment">
                    <a className="btn btn-light-danger">Edit</a>
                  </Link>
                </div>
                <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
                <div className="flex items-center gap-2 p-3 border-2 rounded w-fit">
                  <Image
                    src={`/images/${selectedPaymentMethod.icon}`}
                    width={50}
                    height={50}
                    alt={selectedPaymentMethod.method}
                  />
                  <span className="text-md font-medium">
                    {selectedPaymentMethod.method}
                  </span>
                </div>
              </div>

              <div className="bg-white py-3 px-4 rounded shadow-sm">
                <div className="border-b pb-3 mb-1">
                  <Link href="/cart">
                    <a className="btn btn-light-danger">Edit</a>
                  </Link>
                </div>
                {cartItems.map((item) => (
                  <div key={item.slug} className={styles.cartList}>
                    <div className="flex gap-3 basis-80 items-center">
                      <div className={styles.cartImg}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          objectFit="cover"
                          width={70}
                          height={70}
                        />
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <a className="font-medium text-lg hover:underline hover:underline-offset-2">
                          {item.name}
                        </a>
                      </Link>
                    </div>
                    <h4 className="w-24 font-medium py-1 text-center text-lg border rounded">
                      {item.qty}
                    </h4>
                    <div className="font-medium text-lg">
                      <h4 className="text-red-500 font-semibold">
                        ${item.price * item.qty}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white shadow-sm px-4 py-3 rounded h-fit">
              <div className="border-b pb-3 mb-2">
                <h3 className="text-xl font-semibold">Order Summary</h3>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium mr-2">
                  Items ({totalQty}):
                </span>
                <span className="font-medium text-lg text-red-500">
                  ${itemsPrice}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium mr-2">Tax (15%):</span>
                <span className="font-medium text-lg text-red-500">
                  ${taxPrice}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium mr-2">Shipping:</span>
                <span className="font-medium text-lg text-red-500">
                  ${shippingPrice}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium mr-2">Total Price:</span>
                <span className="font-medium text-lg text-red-500">
                  ${totalDuePrice}
                </span>
              </div>
              <button
                disabled={loading}
                onClick={placeOrderHandler}
                className="btn btn-light-warning w-full font-semibold"
              >
                {loading ? 'Loading...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

PlaceOrderScreen.auth = true;
export default PlaceOrderScreen;
