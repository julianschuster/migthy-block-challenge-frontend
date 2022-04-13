import Cookies from 'cookies';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';

export default async function handler(req, res) {
  const { method } = req;
  const cookies = new Cookies(req, res);

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const userId = cookies.get('userId');
        const user = await User.findById(userId);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { username, pwd } = JSON.parse(req.body);
        const user = await User.findOne({ username, password: pwd });
        const now = new Date();
        const sevenDays = new Date(now.setDate(now.getDate() + 7));
        cookies.set('userId', user._id.toString(), {
          httpOnly: true,
          sameSite: 'strict',
          expires: sevenDays,
        });
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
