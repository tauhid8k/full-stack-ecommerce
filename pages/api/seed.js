import { dbConnect, dbDisconnect } from '../../utils/db';
import data from '../../utils/data';
import User from '../../models/User';

const handler = async (req, res) => {
  await dbConnect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await dbDisconnect();
  res.json('Seeded Successfully');
};

export default handler;
