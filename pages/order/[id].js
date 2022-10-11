import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import styles from '../../styles/Cart.module.css';
import { Layout } from '../../components';
import { getError } from '../../utils/error';
import axios from 'axios';
import { formatDate, addDateHours } from '../../utils/dateFormat';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderScreen = () => {
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    totalItems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    createdAt,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <div className="mt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-medium">Order ID: {orderId}</h1>
          <div className="text-base font-medium">
            <span className="block">{formatDate(createdAt)}</span>
            <span className="block text-yellow-600">
              Order will expire after 2 hours if not paid at
              <strong> {addDateHours(createdAt, 2)}</strong>
            </span>
          </div>
        </div>
        {loading ? (
          <div className="full-screen">
            <div className="spinner text-primary w-12 h-12" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="full-screen">
            <h4 className="text-red-500 text-2xl font-medium">{error}</h4>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-4">
            <div className="md:col-span-3">
              <div className="bg-white py-3 px-4 rounded shadow-sm mb-5">
                <div className="mb-3">
                  <h3 className="mb-2 font-medium text-xl">Delivery Status:</h3>
                  {isDelivered ? (
                    <div className="bg-green-100 text-green-700 p-3 text-lg font-semibold rounded">
                      <h4>Delivered at {formatDate(deliveredAt)}</h4>
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-700 p-3 text-lg font-semibold rounded">
                      <h4>Not Delivered</h4>
                    </div>
                  )}
                </div>
                <h3 className="mb-2 font-medium text-xl">Payment Status:</h3>
                <div>
                  {isPaid ? (
                    <div className="bg-green-100 text-green-700 p-3 text-lg font-semibold rounded">
                      <h4>Paid at {formatDate(paidAt)}</h4>
                    </div>
                  ) : (
                    <div className="bg-red-100 text-red-700 p-3 text-lg font-semibold rounded">
                      <h4>Not Paid</h4>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white py-3 px-4 rounded shadow-sm">
                <div className="mb-3 pb-3 border-b">
                  <h2 className="text-lg font-semibold mb-2">
                    Shipping Address
                  </h2>
                  <div className="text-md font-medium">
                    <span className="block mb-1">
                      <strong>Name:</strong> {shippingAddress.fullName}
                    </span>
                    <span className="block mb-1">
                      <strong>Address: </strong>
                      {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postal}`}
                    </span>
                    <span className="block mb-1">
                      <strong>Mobile:</strong> {shippingAddress.mobile}
                    </span>
                  </div>
                </div>

                <div className="mb-3 pb-5 border-b">
                  <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
                  <div className="flex items-center gap-2 p-3 border-2 rounded w-fit">
                    <Image
                      src={`/images/${paymentMethod.icon}`}
                      width={50}
                      height={50}
                      alt={paymentMethod.method}
                    />
                    <span className="text-md font-medium">
                      {paymentMethod.method}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Ordered Items</h2>
                  {orderItems.map((item) => (
                    <div key={item._id} className={styles.cartList}>
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
            </div>
            <div className="bg-white shadow-sm px-4 py-3 rounded h-fit">
              <div className="border-b pb-3 mb-2">
                <h3 className="text-xl font-semibold">Order Summary</h3>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-medium mr-2">
                  Items ({totalItems}):
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
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

OrderScreen.auth = true;
export default OrderScreen;
