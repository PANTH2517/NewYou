import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Task from '../server/models/Task.js';
import User from '../server/models/User.js';
import Proof from '../server/models/Proof.js';
import AdminSettings from '../server/models/AdminSettings.js';

dotenv.config();

const VALID_ATLAS_URI = 'mongodb+srv://dhggaming49_db_user:Panth_2517@wpdbms.tjvixh1.mongodb.net/NewYou?retryWrites=true&w=majority&appName=WPDBMS';

async function purge() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(VALID_ATLAS_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    await Task.deleteMany({});
    await User.deleteMany({});
    await Proof.deleteMany({});
    await AdminSettings.deleteMany({});

    console.log("🧹 PURGED ALL DUMMY DATA FROM MONGODB ATLAS CLEANLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Purge Error:", err.message);
    process.exit(1);
  }
}

purge();
