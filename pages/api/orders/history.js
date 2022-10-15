import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import { dbConnect, dbDisconnect } from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login required!' });
  }

  const { user } = session;
  await dbConnect();
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
  await dbDisconnect();
  res.send(orders);
};

export default handler;
