import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Fitness' },
  difficulty: { type: String, default: 'Medium' },
  assignedTo: { type: String, default: 'all' },
  requiresProof: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  currentValue: { type: Number, default: 0 },
  targetValue: { type: Number, default: 1 },
  unit: { type: String, default: 'times' },
  icon: { type: String, default: 'Zap' },
  points: { type: Number, default: 120 },
  proofStatus: { type: String, default: 'none' },
  proofUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Task', TaskSchema);
