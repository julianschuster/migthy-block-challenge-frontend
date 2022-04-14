import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/user';

export const getUser = async (id) => User.findById(id).lean();

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const user = await getUser(req.query.id);
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
