import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import { dbConnect, dbDisconnect } from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send({ message: 'Login required!' });
  }

  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

async function getHandler(req, res) {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 });
  await dbDisconnect();
  res.send(products);
}

async function postHandler(req, res) {
  await dbConnect();
  const newProduct = new Product({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/default_product_img.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();
  await dbDisconnect();
  res.send({ message: 'Product added successfully', product });
}

export default handler;
