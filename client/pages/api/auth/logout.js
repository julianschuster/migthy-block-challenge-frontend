import Cookies from 'cookies';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';

export default async function handler(req, res) {
  const { method } = req;
  const cookies = new Cookies(req, res);

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        cookies.set('userId');
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
