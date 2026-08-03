import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Task from '../server/models/Task.js';
import User from '../server/models/User.js';
import Proof from '../server/models/Proof.js';
import AdminSettings from '../server/models/AdminSettings.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

async function wipeAll() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    await Task.deleteMany({});
    await User.deleteMany({});
    await Proof.deleteMany({});
    await AdminSettings.deleteMany({});

    console.log("🧹 SUCCESS! Wiped all 4 collections in MongoDB Atlas clean!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Wipe Error:", err.message);
    process.exit(1);
  }
}

wipeAll();
