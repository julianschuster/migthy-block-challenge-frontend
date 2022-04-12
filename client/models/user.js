import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  pwd: String,
  email: String,
  picture: String,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
