import Cookies from 'cookies';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  const cookies = new Cookies(req, res);

  switch (method) {
    case 'GET':
      try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const user = await User.create(JSON.parse(req.body));

        const now = new Date();
        const sevenDays = new Date(now.setDate(now.getDate() + 7));
        cookies.set('userId', user._id.toString(), {
          httpOnly: true,
          sameSite: 'strict',
          expires: sevenDays,
        });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
