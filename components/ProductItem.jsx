import Link from 'next/link';
import styles from '../styles/Product.module.css';
import Image from 'next/image';
import Rating from './Rating';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import axios from 'axios';

const ProductItem = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = async (qty, product) => {
    // Check stock before add item to the cart
    const cartItem = cartItems.find((item) => item.slug === product.slug);
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (qty >= data.countInStock || cartItem?.qty >= data.countInStock) {
      toast.error('Quantity exceeds stock');
      return;
    }
    // Add to cart
    dispatch(addToCart({ ...product, qty }));
    toast.success('Item Added to Cart');
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="card">
        <Link href={`/product/${product.slug}`}>
          <a>
            <div className={styles.productCardImg}>
              <Image
                src={product.image}
                objectFit="cover"
                objectPosition="top"
                layout="fill"
                priority
                alt=""
              />
            </div>
          </a>
        </Link>
        <div className="card-body p-3 shadow-sm rounded-b">
          <Link href={`/product/${product.slug}`}>
            <a className="font-semibold text-xl text-gray-900 mb-1">
              {product.name}
            </a>
          </Link>
          <div className="flex justify-between items-center mb-2">
            <div className="text-xl text-red-500 font-medium">
              ${product.price}
            </div>
            <div className="text-lg">
              <Rating value={product.rating} />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => addToCartHandler(1, product)}
              className="btn btn-light-secondary grow font-bold"
            >
              Add to Cart
            </button>
            <button className="btn btn-light-primary font-bold">Buy Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
