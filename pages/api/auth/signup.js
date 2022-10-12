import { dbConnect, dbDisconnect } from '../../../utils/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name) return res.status(422).json({ message: 'Name is required!' });
  if (!email || !email.includes('@'))
    return res.status(422).json({ message: 'Valid email is required!' });
  if (!password)
    return res.status(422).json({ message: 'Password is required!' });
  if (password && password.length < 8)
    return res.status(422).json({ message: 'Minimum 8 characters required' });

  await dbConnect();
  const existUser = await User.findOne({ email });
  if (existUser) {
    res.status(422).json({
      message: 'User already exist!',
    });
    await dbDisconnect();
    return;
  }

  const newUser = new User({
    name,
    email,
    password: bcrypt.hashSync(password),
  });

  const user = await newUser.save();
  await dbDisconnect();
  res.status(201).send({
    message: 'User created',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
