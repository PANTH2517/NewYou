import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Task from '../server/models/Task.js';
import User from '../server/models/User.js';
import Proof from '../server/models/Proof.js';
import AdminSettings from '../server/models/AdminSettings.js';

dotenv.config();

const VALID_ATLAS_URI = 'mongodb+srv://dhggaming49_db_user:Panth_2517@wpdbms.tjvixh1.mongodb.net/NewYou?retryWrites=true&w=majority&appName=WPDBMS';

async function resetFresh() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(VALID_ATLAS_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    // 1. Clear all existing data
    await Task.deleteMany({});
    await User.deleteMany({});
    await Proof.deleteMany({});
    await AdminSettings.deleteMany({});
    console.log("🧹 Cleared all existing data across all collections.");

    // 2. Instantiate default clean AdminSettings ready for per-member tones
    await AdminSettings.create({
      id: 'admin_settings',
      motivationalCategory: 'hard',
      userTonePreferences: {}
    });
    console.log("✨ Instantiated fresh clean AdminSettings collection for member tone tracking!");

    console.log("🎉 DATABASE IS NOW 100% FRESH AND CLEAN!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset Error:", err.message);
    process.exit(1);
  }
}

resetFresh();
