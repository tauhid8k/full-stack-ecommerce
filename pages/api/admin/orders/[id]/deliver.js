import { getSession } from 'next-auth/react';
import Order from '../../../../../models/Order';
import { dbConnect, dbDisconnect } from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send({ message: 'Login required!' });
  }

  await dbConnect();
  const order = await Order.findById(req.query.id);
  if (order) {
    order.isDelivered = true;
    order.isPaid = true;
    order.deliveredAt = new Date();
    order.paidAt = new Date();
    const deliveredOrder = await order.save();
    await dbDisconnect();
    res.send({
      message: 'Order delivered',
      order: deliveredOrder,
    });
  } else {
    await dbDisconnect();
    res.status(404).send({ message: 'Error: order not found!' });
  }
};

export default handler;
