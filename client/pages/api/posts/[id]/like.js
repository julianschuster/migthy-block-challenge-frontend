import mongoose from 'mongoose';
import dbConnect from '../../../../lib/dbConnect';
import Post from '../../../../models/post';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const users = await Post.find({});
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const { userId } = JSON.parse(req.body);
        const finalUserId = mongoose.Types.ObjectId(userId);

        const post = await Post.findById(req.query.id);
        const condition = post.likes.includes(finalUserId) ? '$pull' : '$addToSet';

        await Post.findByIdAndUpdate(req.query.id, {
          [condition]: {
            likes: finalUserId,
          },
        });

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
