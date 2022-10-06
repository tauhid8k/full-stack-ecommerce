import { Layout, Products } from '../components';
import { dbConnect, dbDisconnect } from '../utils/db';
import Product from '../models/Product';

export default function Home({ products }) {
  return (
    <Layout>
      <Products products={products} />
    </Layout>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  const response = await Product.find().lean();
  const products = await JSON.parse(JSON.stringify(response));
  await dbDisconnect();
  return {
    props: {
      products,
    },
  };
}
