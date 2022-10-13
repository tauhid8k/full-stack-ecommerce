import { getSession } from 'next-auth/react';
import { dbConnect, dbDisconnect } from '../../../utils/db';
import Order from '../../../models/Order';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login required!' });
  }

  const { user } = session;
  await dbConnect();

  const newOrder = new Order({
    ...req.body,
    user: user._id,
  });

  const order = await newOrder.save();
  await dbDisconnect();

  res.status(201).send(order);
};

export default handler;
