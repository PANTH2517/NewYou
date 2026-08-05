import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../server/models/User.js';
import AdminSettings from '../server/models/AdminSettings.js';

dotenv.config();

const VALID_ATLAS_URI = 'mongodb+srv://dhggaming49_db_user:Panth_2517@wpdbms.tjvixh1.mongodb.net/NewYou?retryWrites=true&w=majority&appName=WPDBMS';

const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL || 'admin@newyou.com';

const adminUserData = {
  id: 'admin_user_01',
  email: ADMIN_EMAIL,
  name: 'Admin Commander',
  handle: '@admin',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  level: 12,
  title: 'Supreme Architect',
  xp: 5000,
  nextLevelXp: 5000,
  streak: 10,
  highestStreak: 20
};

async function setupAdminOnly() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(VALID_ATLAS_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    // 1. Seed / Upsert Admin User in users collection
    await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      adminUserData,
      { upsert: true, new: true }
    );
    console.log("✅ Admin user credentials registered in MongoDB Atlas [users] collection!");

    // 2. Ensure AdminSettings exists for tone tracking
    await AdminSettings.findOneAndUpdate(
      { id: 'admin_settings' },
      { id: 'admin_settings', motivationalCategory: 'hard', userTonePreferences: {} },
      { upsert: true }
    );
    console.log("⚙️ AdminSettings collection initialized for live member tone tracking!");

    console.log("🎉 ADMIN SETUP COMPLETE! Ready for new members to join.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Setup Error:", err.message);
    process.exit(1);
  }
}

setupAdminOnly();
