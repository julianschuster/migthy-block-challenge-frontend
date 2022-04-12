import Cookies from 'cookies';
import dbConnect from '../../../lib/dbConnect';
import Post from '../../../models/post';

export default async function handler(req, res) {
  const { method } = req;

  const cookies = new Cookies(req, res);
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await Post.find({}).sort('-date');
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { post } = JSON.parse(req.body);
        console.log(post);
        const userId = cookies.get('userId');
        const posted = await Post.create({ ...post, user: userId });
        res.status(201).json({ success: true, data: posted });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
