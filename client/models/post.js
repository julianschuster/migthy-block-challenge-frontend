import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  url: String,
  description: String,
  date: Date,
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
