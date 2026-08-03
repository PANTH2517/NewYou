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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/newyou';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`⚡ MongoDB Connected Successfully: ${MONGODB_URI}`))
  .catch((err) => console.warn(`⚠️ MongoDB Connection Warning: ${err.message}. Running fallback mode.`));

// Root Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NewYou MongoDB Backend Engine Active 🚀' });
});

// ==========================================
// 1. HABIT TASKS ENDPOINTS
// ==========================================
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
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

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
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
app.get('/api/proofs', async (req, res) => {
  try {
    const proofs = await Proof.find().sort({ createdAt: -1 });
    res.json(proofs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/proofs', async (req, res) => {
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

app.put('/api/proofs/:id', async (req, res) => {
  try {
    const proof = await Proof.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(proof);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/proofs/:id', async (req, res) => {
  try {
    await Proof.findOneAndDelete({ id: req.params.id });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/proofs', async (req, res) => {
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
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ email: { $ne: 'demo' }, name: { $ne: 'demo' } }).sort({ updatedAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    if (userData.email === 'demo' || userData.name === 'demo') {
      return res.json({ ignored: true });
    }
    const user = await User.findOneAndUpdate(
      { id: userData.id },
      userData,
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
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
app.get('/api/admin/settings', async (req, res) => {
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

app.put('/api/admin/settings', async (req, res) => {
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

// Reset System Database Endpoint
app.post('/api/system/reset', async (req, res) => {
  try {
    await Task.deleteMany({});
    await Proof.deleteMany({});
    await User.deleteMany({});
    await AdminSettings.deleteMany({});
    res.json({ success: true, message: 'Database wiped clean' });
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
