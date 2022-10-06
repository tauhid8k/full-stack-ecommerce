import { dbConnect, dbDisconnect } from '../../utils/db';
import data from '../../utils/data';
import Product from '../../models/Product';

const handler = async (req, res) => {
  await dbConnect();
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await dbDisconnect();
  res.json('Seeded Product Successfully');
};

export default handler;
