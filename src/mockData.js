export const INITIAL_USER = {
  id: 'usr_001',
  name: 'NewYou Member',
  handle: '@member',
  role: 'user',
  avatar: null,
  level: 1,
  title: 'Novice Initiated',
  xp: 0,
  nextLevelXp: 250,
  streak: 0,
  highestStreak: 0,
  consistencyScore: 0,
  joinedDate: 'Today',
};

export const INITIAL_ADMIN = {
  id: 'adm_001',
  name: 'System Admin',
  handle: '@admin',
  role: 'admin',
  avatar: null,
  title: 'Head of System Ops',
};

export const INITIAL_BADGES = [
  { id: 'b1', title: 'First Step', icon: '⚡', description: 'Completed your first target task', unlocked: false },
  { id: 'b2', title: '7-Day Blaze', icon: '🔥', description: 'Maintain a 7-day streak', unlocked: false },
  { id: 'b3', title: 'Hydration Hero', icon: '💧', description: 'Log daily fluid intake target', unlocked: false },
  { id: 'b4', title: 'Iron Discipline', icon: '👑', description: 'Complete 100% daily targets in a single day', unlocked: false },
];

export const DIFFICULTY_XP_MAP = {
  Easy: 80,
  Medium: 120,
  Hard: 200,
  Extreme: 350,
};

// 0 Predefined Tasks by default - created live by Admin!
export const INITIAL_TASKS = [];

// 0 Predefined Tones by default - assigned live by Admin!
export const INITIAL_USER_TONES = {};

// 0 Predefined Proofs by default - submitted live by Users!
export const INITIAL_PROOFS = [];

// Clean initial stats - updated dynamically live!
export const INITIAL_ADMIN_STATS = {
  totalActiveUsers: 0,
  pendingVerifications: 0,
  approvedToday: 0,
  averageConsistency: '0%',
  systemUptime: '100%',
};
