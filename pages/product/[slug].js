import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/Product.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { Layout, Rating } from '../../components';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { dbConnect, dbDisconnect } from '../../utils/db';
import Product from '../../models/Product';

const ProductScreen = ({ product }) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  if (!product) {
    return (
      <Layout title="Not Found!">
        <div className="full-screen">
          <h1 className="text-2xl font-medium">Product Not Found !</h1>
        </div>
      </Layout>
    );
  }

  // Add item to Cart
  const addToCartHandler = (qty) => {
    // Check stock before add item to the cart
    const cartItem = cartItems.find((item) => item.slug === product.slug);
    if (qty >= product.countInStock || cartItem?.qty >= product.countInStock) {
      toast.error('Quantity exceeds stock');
      return;
    }
    // Add to cart
    dispatch(addToCart({ ...product, qty }));
    toast.success('Item Added to Cart');
  };

  return (
    <>
      <Toaster />
      <Layout title={product.name}>
        <div className="mt-20">
          <Link href="/">
            <a className="btn btn-outline-primary font-semibold mb-4">
              Go Back
            </a>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className={styles.productDetailImg}>
                <Image
                  src={product.image}
                  objectFit="cover"
                  objectPosition="top"
                  layout="fill"
                  priority
                  alt=""
                />
              </div>
              <div className="bg-white py-3 px-4 rounded-b">
                <p>
                  <span className="text-xl font-semibold mr-2">Detail:</span>
                  <span className="font-medium text-lg">
                    {product.description}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:col-span-2 bg-white rounded py-3 px-4">
              <h1 className="text-2xl font-medium mb-4">{product.name}</h1>
              <ul className="list mb-4">
                <li className="list-item flex items-center">
                  <h4>
                    <span className="text-xl font-semibold mr-2">Status:</span>
                    <span
                      className={`font-medium text-lg ${
                        product.countInStock === 0 ? 'text-red-500' : ''
                      } `}
                    >
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </h4>
                </li>
                <li className="list-item flex items-center">
                  <div className="text-lg">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} Reviews`}
                    />
                  </div>
                </li>
                <li className="list-item flex items-center">
                  <span className="text-xl font-semibold mr-2">Price:</span>
                  <span className="font-medium text-lg text-red-500">
                    ${product.price}
                  </span>
                </li>
              </ul>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCartHandler(1)}
                  className="btn btn-light-secondary font-bold"
                >
                  Add to Cart
                </button>
                <button className="btn btn-light-warning font-bold">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await dbConnect();
  const response = await Product.findOne({ slug }).lean();
  const product = await JSON.parse(JSON.stringify(response));
  await dbDisconnect();
  return {
    props: {
      product: product ? product : null,
    },
  };
}

export default ProductScreen;
