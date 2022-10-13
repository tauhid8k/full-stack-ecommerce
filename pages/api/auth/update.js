import { getSession } from 'next-auth/react';
import User from '../../../models/User';
import { dbConnect, dbDisconnect } from '../../../utils/db';
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(400).json({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'Login required!' });
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name) return res.status(422).json({ message: 'Name is required!' });
  if (!email || !email.includes('@'))
    return res.status(422).json({ message: 'Valid email is required!' });
  if (!password && password.length < 8)
    return res.status(422).json({ message: 'Minimum 8 characters required' });

  const { user } = session;

  await dbConnect();
  const toUpdateUser = await User.findById(user._id);
  const toCheckUserEmail = await User.findOne({ email });

  if (name) {
    toUpdateUser.name = name;
  }

  if (email === user.email) {
    toUpdateUser.email = email;
  } else if (toCheckUserEmail) {
    res.status(422).json({
      message: 'Email already exist!',
    });
    await dbDisconnect();
    return;
  } else {
    toUpdateUser.email = email;
  }
  if (password) {
    toUpdateUser.password = bcrypt.hashSync(password);
  }

  await toUpdateUser.save();
  await dbDisconnect();
  res.send({ message: 'User updated' });
};

export default handler;
