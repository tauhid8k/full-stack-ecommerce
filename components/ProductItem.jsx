import Link from 'next/link';
import styles from '../styles/Product.module.css';
import Image from 'next/image';
import Rating from './Rating';

const ProductItem = ({ product }) => {
  return (
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
          <button className="btn btn-light-secondary grow font-bold">
            Add to Cart
          </button>
          <button className="btn btn-light-primary font-bold">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
