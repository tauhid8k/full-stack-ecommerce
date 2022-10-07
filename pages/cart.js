import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from '../styles/Cart.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Layout } from '../components';
import { removeFromCart, updateCartQty } from '../redux/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import useCart from '../utils/useCart';
import axios from 'axios';

const CartScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { totalQty, totalPrice } = useCart();
  const { cartItems } = useSelector((state) => state.cart);

  const updateCartQtyHandler = async (item, qty) => {
    const { data } = await axios.get(`/api/products/${item._id}`);

    if (qty >= data.countInStock) {
      return toast.error('Quantity exceeds stock');
    }

    dispatch(updateCartQty({ slug: item.slug, qty }));
    toast.success('Cart Updated', {
      style: {
        background: '#444',
        color: '#fff',
      },
    });
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <Layout title="Shopping Cart">
        <div className="mt-24">
          <Link href="/">
            <a className="btn btn-outline-primary font-semibold mb-4">
              Go Back
            </a>
          </Link>
          <h1 className="text-3xl font-medium mb-4">Your Cart</h1>
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
              <div className="md:col-span-3 bg-white py-3 px-4 rounded shadow-sm">
                {cartItems.map((item) => (
                  <div key={item.slug} className={styles.cartList}>
                    <div className="flex gap-3 basis-80 items-center">
                      <div className={styles.cartImg}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          objectFit="cover"
                          width={100}
                          height={100}
                        />
                      </div>

                      <Link href={`/product/${item.slug}`}>
                        <a className="font-medium text-lg hover:underline hover:underline-offset-2">
                          {item.name}
                        </a>
                      </Link>
                    </div>
                    <div className="font-medium text-lg flex gap-2">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          updateCartQtyHandler(item, Number(e.target.value))
                        }
                        className="form-select w-24 font-medium py-1 text-center text-lg"
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="font-medium text-lg">
                      <h4 className="text-red-500 font-semibold">
                        ${item.price * item.qty}
                      </h4>
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.slug))}
                      className="btn btn-light-danger"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white shadow-sm px-4 py-3 rounded h-fit">
                <h4 className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold mr-2">
                    Subtotal ({totalQty}):
                  </span>
                  <span className="font-semibold text-lg text-red-500">
                    ${totalPrice}
                  </span>
                </h4>
                <button
                  onClick={() => router.push('login?redirect=shipping')}
                  className="btn btn-light-warning w-full font-semibold"
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
