import ProductItem from './ProductItem';

const Products = ({ products }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-20">
      {products.map((product) => (
        <ProductItem product={product} key={product.slug} />
      ))}
    </div>
  );
};

export default Products;
