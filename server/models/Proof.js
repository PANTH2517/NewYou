import mongoose from 'mongoose';

const ProofSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  taskId: { type: String, required: true },
  taskTitle: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  userAvatar: { type: String, default: null },
  imageUrl: { type: String, required: true },
  submittedAt: { type: String, default: 'Just now' },
  caption: { type: String, default: '' },
  status: { type: String, default: 'pending' }, // 'pending' | 'approved' | 'rejected'
  rejectReason: { type: String, default: '' },
  category: { type: String, default: 'Fitness' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Proof', ProofSchema);
