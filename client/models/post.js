import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '' },
  date: { type: Date, default: new Date() },
  extension: String,
  likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
