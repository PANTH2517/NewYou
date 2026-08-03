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

const seedHabits = [
  {
    id: 'task-1',
    title: 'Hit 12000 Steps',
    category: 'Fitness',
    difficulty: 'Medium',
    assignedTo: 'all',
    requiresProof: true,
    completed: false,
    currentValue: 0,
    targetValue: 12000,
    unit: 'Steps',
    icon: 'Footprints',
    points: 120,
    proofStatus: 'none',
    description: 'Upload any valid Phone Screen Shot or Watch app showing 12000+ steps.'
  },
  {
    id: 'task-2',
    title: 'Hydration 3 Liters',
    category: 'Wellness',
    difficulty: 'Easy',
    assignedTo: 'all',
    requiresProof: false,
    completed: false,
    currentValue: 0,
    targetValue: 3,
    unit: 'Liters',
    icon: 'Droplets',
    points: 80,
    proofStatus: 'none',
    description: 'Track and consume 3 liters of water throughout the day.'
  },
  {
    id: 'task-3',
    title: 'Deep Focus Reading',
    category: 'Productivity',
    difficulty: 'Hard',
    assignedTo: 'all',
    requiresProof: true,
    completed: false,
    currentValue: 0,
    targetValue: 30,
    unit: 'Mins',
    icon: 'BookOpen',
    points: 200,
    proofStatus: 'none',
    description: 'Read a physical or digital non-fiction book without distractions.'
  }
];

const seedUsers = [
  {
    id: 'admin_user_01',
    email: 'admin@newyou.com',
    name: 'Admin Chief',
    handle: '@admin',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    level: 12,
    title: 'Supreme Architect',
    xp: 4850,
    nextLevelXp: 5000,
    streak: 15,
    highestStreak: 21
  },
  {
    id: 'user_alex_02',
    email: 'alex.vanguard@newyou.com',
    name: 'Alex Rivera',
    handle: '@arivera',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    level: 4,
    title: 'Consistency Crusader',
    xp: 1240,
    nextLevelXp: 1500,
    streak: 7,
    highestStreak: 12
  }
];

const seedProofs = [
  {
    id: 'proof-101',
    taskId: 'task-1',
    taskTitle: 'Hit 12000 Steps',
    userName: 'Alex Rivera',
    userEmail: 'alex.vanguard@newyou.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    imageUrl: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=600',
    submittedAt: '10 mins ago',
    caption: 'Hit 12,450 steps during my morning marathon run!',
    status: 'pending',
    category: 'Fitness'
  }
];

const seedAdminSettings = {
  id: 'admin_settings',
  motivationalCategory: 'hard',
  userTonePreferences: {
    'admin@newyou.com': 'hard',
    'alex.vanguard@newyou.com': 'gentle'
  }
};

async function seedAll() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("⚡ Connected to MongoDB Atlas!");

    // 1. Seed Tasks
    for (const habit of seedHabits) {
      await Task.findOneAndUpdate({ id: habit.id }, habit, { upsert: true });
    }
    console.log("✅ Seeded [tasks] collection!");

    // 2. Seed Users
    for (const u of seedUsers) {
      await User.findOneAndUpdate({ id: u.id }, u, { upsert: true });
    }
    console.log("✅ Seeded [users] collection!");

    // 3. Seed Proofs
    for (const p of seedProofs) {
      await Proof.findOneAndUpdate({ id: p.id }, p, { upsert: true });
    }
    console.log("✅ Seeded [proofs] collection!");

    // 4. Seed Admin Settings
    await AdminSettings.findOneAndUpdate({ id: seedAdminSettings.id }, seedAdminSettings, { upsert: true });
    console.log("✅ Seeded [adminsettings] collection!");

    console.log("🎉 ALL COLLECTIONS FULLY SYNCED AND CREATED IN MONGODB ATLAS!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed Error:", err.message);
    process.exit(1);
  }
}

seedAll();
