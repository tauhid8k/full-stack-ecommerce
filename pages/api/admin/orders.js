import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import { dbConnect, dbDisconnect } from '../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send({ message: 'Login required!' });
  }

  if (req.method === 'GET') {
    await dbConnect();
    const orders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    await dbDisconnect();
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
