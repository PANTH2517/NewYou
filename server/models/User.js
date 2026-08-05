import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  handle: { type: String },
  role: { type: String, default: 'user' },
  avatar: { type: String, default: null },
  level: { type: Number, default: 1 },
  title: { type: String, default: 'Novice Initiated' },
  xp: { type: Number, default: 0 },
  nextLevelXp: { type: Number, default: 250 },
  streak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null },
  gender: { type: String, default: 'unspecified' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);
