/**
 * Database Service Module (NewYou Engine)
 * Supports Firebase Firestore real-time data persistence and MongoDB/Express backend API contracts.
 */

import { getFirestore, doc, collection, setDoc, getDocs, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { app } from '../firebase';

let db = null;
try {
  if (app) {
    db = getFirestore(app);
  }
} catch (e) {
  // Silent fallback for offline / mock dev mode
}

export { db };

// ==========================================
// 1. FIREBASE FIRESTORE REAL-TIME METHODS
// ==========================================

export const syncUserTasksFromCloud = (userId, callback) => {
  if (!db || !userId) return () => {};
  try {
    const q = query(collection(db, 'users', userId, 'tasks'));
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tasks);
    }, (err) => {});
  } catch (e) {
    return () => {};
  }
};

export const saveTaskToCloud = async (userId, task) => {
  if (!db || !userId) return;
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', task.id);
    await setDoc(taskRef, task, { merge: true });
  } catch (e) {
    // Silent catch
  }
};

export const deleteTaskFromCloud = async (userId, taskId) => {
  if (!db || !userId) return;
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (e) {
    // Silent catch
  }
};

export const saveUserProfileToCloud = async (userId, userProfile) => {
  if (!db || !userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Silent catch
  }
};

export const syncAllUsersFromCloud = (callback) => {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(users);
    }, () => {});
  } catch (e) {
    return () => {};
  }
};

export const deleteUserFromCloud = async (userId) => {
  if (!db || !userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (e) {
    // Silent catch
  }
};


export const saveProofToCloud = async (proof) => {
  if (!db || !proof?.id) return;
  try {
    const proofRef = doc(db, 'proofs', proof.id);
    await setDoc(proofRef, {
      ...proof,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    // Silent catch
  }
};

export const deleteProofFromCloud = async (proofId) => {
  if (!db || !proofId) return;
  try {
    const proofRef = doc(db, 'proofs', proofId);
    await deleteDoc(proofRef);
  } catch (e) {
    // Silent catch
  }
};

export const saveBadgesToCloud = async (userId, badges) => {
  if (!db || !userId) return;
  try {
    const badgesRef = doc(db, 'users', userId, 'data', 'badges');
    await setDoc(badgesRef, { badges, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    // Silent catch
  }
};

export const syncAllProofsFromCloud = (callback) => {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'proofs'));
    return onSnapshot(q, (snapshot) => {
      const cloudProofs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(cloudProofs);
    }, () => {});
  } catch (e) {
    return () => {};
  }
};

export const saveAdminSettingsToCloud = async (settings) => {
  if (!db) return;
  try {
    const settingsRef = doc(db, 'system', 'admin_settings');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (e) {
    // Silent catch
  }
};

// ==========================================
// 2. MONGODB / EXPRESS REST API CONTRACTS
// ==========================================

export const MONGODB_CONTRACTS = {
  description: "If connecting to a custom MongoDB server, use these Mongoose Schemas & Express REST Endpoints.",
  mongooseSchemas: `
    // UserSchema.js (Mongoose)
    const UserSchema = new mongoose.Schema({
      uid: { type: String, required: true, unique: true },
      email: { type: String, required: true },
      displayName: String,
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      xp: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      motivationalPreference: { type: String, default: 'hard' }
    });

    // TaskSchema.js (Mongoose)
    const TaskSchema = new mongoose.Schema({
      userId: { type: String, required: true },
      title: { type: String, required: true },
      category: String,
      requiresProof: Boolean,
      completed: Boolean,
      currentValue: Number,
      targetValue: Number,
      unit: String,
      points: Number,
      createdAt: { type: Date, default: Date.now }
    });
  `,
  expressRoutes: `
    // GET /api/tasks/:userId -> fetch user custom tasks
    // POST /api/tasks -> create new task
    // DELETE /api/tasks/:taskId -> delete task
    // POST /api/proofs -> submit media proof
    // PUT /api/admin/tone -> update motivational category tone
  `
};
