import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const isAvailable = !(await User.findOne({ username: req.query.username }));
        res.status(200).json({ success: true, data: isAvailable });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
