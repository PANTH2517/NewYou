import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from '../server/models/User.js';
import AdminSettings from '../server/models/AdminSettings.js';

dotenv.config();

const VALID_ATLAS_URI = 'mongodb+srv://dhggaming49_db_user:Panth_2517@wpdbms.tjvixh1.mongodb.net/NewYou?retryWrites=true&w=majority&appName=WPDBMS';

async function removeExampleUser() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(VALID_ATLAS_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    // 1. Delete example users from users collection
    const deletedUsers = await User.deleteMany({
      $or: [
        { email: /example/i },
        { email: /demo/i },
        { name: /example/i },
        { handle: /example/i }
      ]
    });
    console.log(`🧹 Deleted ${deletedUsers.deletedCount} example users from [users] collection.`);

    // 2. Remove example keys from AdminSettings userTonePreferences
    const settings = await AdminSettings.findOne({ id: 'admin_settings' });
    if (settings && settings.userTonePreferences) {
      const prefs = settings.userTonePreferences;
      let modified = false;

      for (const k of Object.keys(prefs)) {
        if (k.toLowerCase().includes('example') || k.toLowerCase().includes('demo')) {
          delete prefs[k];
          modified = true;
        }
      }

      if (modified) {
        settings.markModified('userTonePreferences');
        await settings.save();
        console.log("🧹 Cleaned example keys from AdminSettings userTonePreferences.");
      }
    }

    console.log("🎉 REMOVED EXAMPLE USER COMPLETELY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
}

removeExampleUser();
