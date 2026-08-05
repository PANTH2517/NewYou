import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import User from './models/User.js';
import Task from './models/Task.js';
import Proof from './models/Proof.js';
import AdminSettings from './models/AdminSettings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const VALID_ATLAS_URI = 'mongodb+srv://dhggaming49_db_user:Panth_2517@wpdbms.tjvixh1.mongodb.net/NewYou?retryWrites=true&w=majority&appName=WPDBMS';

function getValidUri() {
  const envUri = process.env.MONGODB_URI;
  if (!envUri || envUri.includes('<db_password>') || envUri.includes('<password>') || envUri.includes('127.0.0.1')) {
    return VALID_ATLAS_URI;
  }
  return envUri;
}

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  let targetUri = getValidUri();
  try {
    const db = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`⚡ MongoDB Atlas Connected Successfully`);
  } catch (err) {
    console.warn(`⚠️ First connection attempt failed (${err.message}). Retrying with valid Atlas URI...`);
    try {
      const db = await mongoose.connect(VALID_ATLAS_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      isConnected = db.connections[0].readyState === 1;
      console.log(`⚡ MongoDB Atlas Connected Successfully via fallback URI`);
    } catch (retryErr) {
      console.error("❌ MongoDB Atlas Connection Error:", retryErr.message);
      throw retryErr;
    }
  }
}

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Middleware to ensure MongoDB Atlas connection on EVERY API request
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed: " + err.message });
  }
});

// Root Check Endpoint
app.get(['/api/health', '/health'], async (req, res) => {
  try {
    await connectDB();
    res.json({ status: 'ok', database: 'connected', message: 'NewYou MongoDB Backend Engine Active 🚀' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// ==========================================
// 1. HABIT TASKS ENDPOINTS
// ==========================================
app.get(['/api/tasks', '/tasks'], async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/tasks', '/tasks'], async (req, res) => {
  try {
    const taskData = req.body;
    const task = await Task.findOneAndUpdate(
      { id: taskData.id },
      taskData,
      { upsert: true, new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/tasks/:id', '/tasks/:id'], async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/tasks/:id', '/tasks/:id'], async (req, res) => {
  try {
    await Task.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PROOFS ENDPOINTS
// ==========================================
app.get(['/api/proofs', '/proofs'], async (req, res) => {
  try {
    const proofs = await Proof.find().sort({ createdAt: -1 });
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/proofs', '/proofs'], async (req, res) => {
  try {
    const proofData = req.body;
    const proof = await Proof.findOneAndUpdate(
      { id: proofData.id },
      proofData,
      { upsert: true, new: true }
    );
    res.json(proof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/proofs/:id', '/proofs/:id'], async (req, res) => {
  try {
    const proof = await Proof.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(proof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/proofs/:id', '/proofs/:id'], async (req, res) => {
  try {
    await Proof.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/proofs', '/proofs'], async (req, res) => {
  try {
    await Proof.deleteMany({});
    res.json({ success: true, message: 'All proofs cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. USER ROSTER ENDPOINTS
// ==========================================
app.get(['/api/users', '/users'], async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: 'demo' }, name: { $ne: 'demo' } }).sort({ updatedAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post(['/api/users', '/users'], async (req, res) => {
  try {
    const userData = req.body;
    if (!userData || userData.email === 'demo' || userData.name === 'demo') {
      return res.json({ ignored: true });
    }
    const userId = userData.id || userData.uid || `user-${Date.now()}`;
    const user = await User.findOneAndUpdate(
      { $or: [{ id: userId }, { email: userData.email }] },
      { ...userData, id: userId, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(['/api/users/:id', '/users/:id'], async (req, res) => {
  try {
    await User.findOneAndDelete({ $or: [{ id: req.params.id }, { email: req.params.id }, { name: req.params.id }] });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ADMIN SETTINGS ENDPOINTS
// ==========================================
app.get(['/api/admin/settings', '/admin/settings'], async (req, res) => {
  try {
    let settings = await AdminSettings.findOne({ id: 'admin_settings' });
    if (!settings) {
      settings = await AdminSettings.create({ id: 'admin_settings', motivationalCategory: 'hard', userTonePreferences: {} });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(['/api/admin/settings', '/admin/settings'], async (req, res) => {
  try {
    const settings = await AdminSettings.findOneAndUpdate(
      { id: 'admin_settings' },
      req.body,
      { upsert: true, new: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 NewYou MongoDB Server running on http://localhost:${PORT}`);
  });
}

export default app;
