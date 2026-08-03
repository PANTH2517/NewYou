import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema({
  id: { type: String, default: 'admin_settings', unique: true },
  motivationalCategory: { type: String, default: 'hard' },
  userTonePreferences: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('AdminSettings', AdminSettingsSchema);
