/**
 * MongoDB / Express API Service Client
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for safe fetch with error handling
const fetchJson = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    // Silent catch for offline or un-started backend
    return null;
  }
};

// HABITS & TASKS API
export const apiFetchTasks = async () => {
  return await fetchJson('/tasks');
};

export const apiSaveTask = async (task) => {
  return await fetchJson('/tasks', {
    method: 'POST',
    body: JSON.stringify(task)
  });
};

export const apiUpdateTask = async (taskId, taskData) => {
  return await fetchJson(`/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  });
};

export const apiDeleteTask = async (taskId) => {
  return await fetchJson(`/tasks/${taskId}`, {
    method: 'DELETE'
  });
};

// PROOFS API
export const apiFetchProofs = async () => {
  return await fetchJson('/proofs');
};

export const apiSaveProof = async (proof) => {
  return await fetchJson('/proofs', {
    method: 'POST',
    body: JSON.stringify(proof)
  });
};

export const apiUpdateProof = async (proofId, proofData) => {
  return await fetchJson(`/proofs/${proofId}`, {
    method: 'PUT',
    body: JSON.stringify(proofData)
  });
};

export const apiDeleteProof = async (proofId) => {
  return await fetchJson(`/proofs/${proofId}`, {
    method: 'DELETE'
  });
};

// USERS ROSTER API
export const apiFetchUsers = async () => {
  return await fetchJson('/users');
};

export const apiSaveUser = async (userData) => {
  return await fetchJson('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const apiDeleteUser = async (userId) => {
  return await fetchJson(`/users/${userId}`, {
    method: 'DELETE'
  });
};

// ADMIN SETTINGS API
export const apiFetchAdminSettings = async () => {
  return await fetchJson('/admin/settings');
};

export const apiSaveAdminSettings = async (settings) => {
  return await fetchJson('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
};

// RESET SYSTEM DATABASE
export const apiResetSystem = async () => {
  return await fetchJson('/system/reset', {
    method: 'POST'
  });
};
