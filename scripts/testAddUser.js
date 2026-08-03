import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../server/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

async function addUser() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    const testUser = {
      id: `user-test-${Date.now()}`,
      email: 'member.test@newyou.com',
      name: 'Test Member',
      handle: '@testmember',
      role: 'user',
      level: 1,
      xp: 120,
      streak: 3
    };

    const user = await User.findOneAndUpdate(
      { email: testUser.email },
      testUser,
      { upsert: true, new: true }
    );

    console.log("✅ SUCCESS! Written test user to MongoDB Atlas:", user);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error adding user:", err.message);
    process.exit(1);
  }
}

addUser();
