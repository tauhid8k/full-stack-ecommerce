import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import { dbConnect, dbDisconnect } from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Login required!');
  }

  await dbConnect();
  const order = await Order.findById(req.query.id);
  await dbDisconnect();
  res.send(order);
};

export default handler;
