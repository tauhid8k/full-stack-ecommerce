import { getSession } from 'next-auth/react';
import Product from '../../../../../models/Product';
import { dbConnect, dbDisconnect } from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send({ message: 'Login required!' });
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

async function getHandler(req, res) {
  await dbConnect();
  const product = await Product.findById(req.query.id);
  await dbDisconnect();
  res.send(product);
}

async function putHandler(req, res) {
  await dbConnect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    await dbDisconnect();
    res.send({ message: 'Product updated' });
  } else {
    await dbDisconnect();
    res.status(404).send({ message: 'Product not found' });
  }
}

async function deleteHandler(req, res) {
  await dbConnect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await product.remove();
    await dbDisconnect();
    res.send({ message: 'Product Deleted' });
  } else {
    await dbDisconnect();
    res.status(404).send({ message: 'Product not found' });
  }
}

export default handler;
