import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { CheckoutWizard, Layout } from '../components';
import { setPaymentMethod } from '../redux/cartSlice';
import { useSelector, useDispatch } from 'react-redux';
import cookies from 'js-cookie';
import data from '../utils/data';

const PaymentScreen = () => {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState(0);
  const dispatch = useDispatch();
  const { cartItems, paymentMethod, shippingAddress } = useSelector(
    (state) => state.cart
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedPayment) {
      toast.error('Payment method is required', {
        style: {
          background: '#444',
          color: '#fff',
        },
      });
      return;
    }
    dispatch(setPaymentMethod(selectedPayment));
    cookies.set(
      'cart',
      JSON.stringify({
        cartItems,
        shippingAddress,
        paymentMethod: selectedPayment,
      })
    );
    router.push('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress) {
      return router.push('/shipping');
    }
    setSelectedPayment(paymentMethod);
  }, [router, shippingAddress, paymentMethod]);

  return (
    <>
      <Toaster />
      <Layout title="Payment Method">
        <div className="mt-24 mb-8">
          <CheckoutWizard activeStep={2} />
        </div>
        <form
          onSubmit={submitHandler}
          className="w-full md:w-6/12 mx-auto shadow-sm bg-white p-4 rounded mb-4"
        >
          <h1 className="text-3xl font-medium text-center mb-4">
            Payment Method
          </h1>
          {data.paymentGateWays.map((payment) => (
            <div key={payment.id} className="mb-4">
              <label
                className={`flex items-center p-3 border-2 rounded cursor-pointer ${
                  selectedPayment === payment.id ? 'border-purple-600' : ''
                }`}
              >
                <input
                  type="radio"
                  className="appearance-none"
                  name="paymentMethod"
                  value={payment.id}
                  checked={selectedPayment === payment.id}
                  onChange={() => setSelectedPayment(payment.id)}
                />
                <div className="flex items-center gap-2">
                  <Image
                    src={`/images/${payment.icon}`}
                    width={50}
                    height={50}
                    alt={payment.method}
                  />
                  <span className="text-lg font-medium">{payment.method}</span>
                </div>
              </label>
            </div>
          ))}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => router.push('/shipping')}
              className="btn btn-light-secondary"
            >
              Go Back
            </button>
            <button className="btn btn-primary" type="submit">
              Next
            </button>
          </div>
        </form>
      </Layout>
    </>
  );
};

PaymentScreen.auth = true;
export default PaymentScreen;
