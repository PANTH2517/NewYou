import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  auth,
  onAuthStateChanged,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logoutUser,
} from '../firebase';
import {
  INITIAL_USER,
  INITIAL_ADMIN,
  INITIAL_TASKS,
  INITIAL_PROOFS,
  INITIAL_ADMIN_STATS,
  INITIAL_USER_TONES,
  DIFFICULTY_XP_MAP,
} from '../mockData';
import { 
  saveTaskToCloud, 
  deleteTaskFromCloud, 
  saveAdminSettingsToCloud, 
  syncUserTasksFromCloud,
  saveUserProfileToCloud,
  syncAllUsersFromCloud,
  deleteUserFromCloud,
  saveProofToCloud,
  deleteProofFromCloud,
  saveBadgesToCloud,
  syncAllProofsFromCloud
} from '../services/dbService';
import {
  apiFetchTasks,
  apiSaveTask,
  apiUpdateTask,
  apiDeleteTask,
  apiFetchProofs,
  apiSaveProof,
  apiUpdateProof,
  apiDeleteProof,
  apiFetchUsers,
  apiSaveUser,
  apiDeleteUser,
  apiFetchAdminSettings,
  apiSaveAdminSettings
} from '../services/apiService';
import { XP_LEVELS, MOTIVATIONAL_CATEGORIES, CORE_BADGES, getLevelInfo } from '../constants';
import { generateUniqueMotivationalMessage } from '../utils/motivationalGenerator';

export { XP_LEVELS, MOTIVATIONAL_CATEGORIES, CORE_BADGES, getLevelInfo };

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@newyou.com";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Firebase User & Role State
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('guest');
  const [role, setRole] = useState('user');
  const [authLoading, setAuthLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // App UI State with Persistence Fallback
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('newself_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [admin, setAdmin] = useState(INITIAL_ADMIN);

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('newself_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [proofs, setProofs] = useState(() => {
    const saved = localStorage.getItem('newself_proofs');
    return saved ? JSON.parse(saved) : [];
  });

  // Track Task Completion Counts for Specialized Badges
  const [taskCompletions, setTaskCompletions] = useState(() => {
    const saved = localStorage.getItem('newself_task_completions');
    return saved ? JSON.parse(saved) : {};
  });

  // Dynamic Badges Array (Core Badges + Live Admin Specialized Badges)
  const [badges, setBadges] = useState(() => {
    const saved = localStorage.getItem('newself_badges');
    if (!saved) return CORE_BADGES;
    try {
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map(b => b.id));
      const missingCore = CORE_BADGES.filter(cb => !existingIds.has(cb.id));
      return [...parsed, ...missingCore];
    } catch (e) {
      return CORE_BADGES;
    }
  });

  const [adminStats, setAdminStats] = useState(INITIAL_ADMIN_STATS);
  
  // Per-User Individual Motivational Tone Preferences
  const [userTonePreferences, setUserTonePreferences] = useState(() => {
    const saved = localStorage.getItem('newself_user_tones');
    return saved ? JSON.parse(saved) : INITIAL_USER_TONES;
  });

  const [motivationalCategory, setMotivationalCategory] = useState(() => {
    const saved = localStorage.getItem('newself_global_tone');
    return saved ? saved : 'hard';
  });

  const [streakModalMessage, setStreakModalMessage] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeUploadTask, setActiveUploadTask] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toastMessage, setToastMessage] = useState(null);

  // Persist Badges to LocalStorage
  useEffect(() => {
    localStorage.setItem('newself_badges', JSON.stringify(badges));
  }, [badges]);

  // Persist Task Completions
  useEffect(() => {
    localStorage.setItem('newself_task_completions', JSON.stringify(taskCompletions));
  }, [taskCompletions]);

  // Persist Tasks to LocalStorage
  useEffect(() => {
    localStorage.setItem('newself_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist User to LocalStorage
  useEffect(() => {
    localStorage.setItem('newself_user', JSON.stringify(user));
  }, [user]);

  // Persist Proofs to LocalStorage
  useEffect(() => {
    localStorage.setItem('newself_proofs', JSON.stringify(proofs));
  }, [proofs]);

  // Toast Notification
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Confetti Particle Explosion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#FF6B00', '#00E676', '#9D4EDD', '#FFFFFF']
      });
    } catch (e) {
      console.log('Confetti trigger error:', e);
    }
  };

  // Calculate live progress for any badge
  const getBadgeProgress = (badge) => {
    if (badge.unlocked) return { current: badge.reqTarget, target: badge.reqTarget, percent: 100 };

    const completedCount = tasks.filter(t => t.completed).length;
    const approvedProofs = proofs.filter(p => p.status === 'approved').length;
    const nutritionCount = tasks.filter(t => t.category === 'Nutrition' && t.completed).length;
    const mindfulnessCount = tasks.filter(t => (t.category === 'Mindfulness' || t.category === 'Growth') && t.completed).length;
    const fitnessCount = tasks.filter(t => t.category === 'Fitness' && t.completed).length;
    const currentLevel = getLevelInfo(user.xp).level;

    const maxStepCompleted = tasks
      .filter(t => (t.unit?.toLowerCase().includes('step') || t.title?.toLowerCase().includes('step')) && t.completed)
      .reduce((max, t) => Math.max(max, Number(t.targetValue) || 0), 0);

    let current = 0;
    let target = badge.reqTarget || 1;

    switch (badge.reqType) {
      case 'completedCount': current = completedCount; break;
      case 'streak': current = user.streak || 0; break;
      case 'level': {
        current = Math.max(0, currentLevel - 1);
        target = Math.max(1, badge.reqTarget - 1);
        break;
      }
      case 'xp': current = user.xp || 0; break;
      case 'approvedProofs': current = approvedProofs; break;
      case 'nutritionCount': current = nutritionCount; break;
      case 'mindfulnessCount': current = mindfulnessCount; break;
      case 'fitnessCount': current = fitnessCount; break;
      case 'stepCount': current = maxStepCompleted; break;
      case 'specializedTask': {
        const targetTask = tasks.find(t => t.id === badge.taskId);
        const count = (taskCompletions[badge.taskId] || 0) + (targetTask && targetTask.completed ? 1 : 0);
        current = count;
        break;
      }
      default: current = 0;
    }

    const percent = Math.min(100, Math.max(0, Math.round((current / target) * 100)));
    return { current, target, percent };
  };

  // Automatic Badge Unlock Evaluator
  const checkAndUnlockBadges = (currentTasks, currentProofs, currentXp, currentStreak, customCompletions = null) => {
    const activeCompletions = customCompletions || taskCompletions;
    const completedCount = currentTasks.filter(t => t.completed).length;
    const approvedProofs = currentProofs.filter(p => p.status === 'approved').length;
    const nutritionCount = currentTasks.filter(t => t.category === 'Nutrition' && t.completed).length;
    const mindfulnessCount = currentTasks.filter(t => (t.category === 'Mindfulness' || t.category === 'Growth') && t.completed).length;
    const fitnessCount = currentTasks.filter(t => t.category === 'Fitness' && t.completed).length;
    const currentLevel = getLevelInfo(currentXp).level;

    const maxStepCompleted = currentTasks
      .filter(t => (t.unit?.toLowerCase().includes('step') || t.title?.toLowerCase().includes('step')) && t.completed)
      .reduce((max, t) => Math.max(max, Number(t.targetValue) || 0), 0);

    setBadges(prevBadges =>
      prevBadges.map(badge => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;

        if (badge.reqType === 'completedCount' && completedCount >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'streak' && currentStreak >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'level' && currentLevel >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'xp' && currentXp >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'approvedProofs' && approvedProofs >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'nutritionCount' && nutritionCount >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'mindfulnessCount' && mindfulnessCount >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'fitnessCount' && fitnessCount >= badge.reqTarget) shouldUnlock = true;
        if (badge.reqType === 'stepCount' && maxStepCompleted >= badge.reqTarget) shouldUnlock = true;

        if (badge.reqType === 'specializedTask' && badge.taskId) {
          const targetTask = currentTasks.find(t => t.id === badge.taskId);
          const compCount = (activeCompletions[badge.taskId] || 0) + (targetTask && targetTask.completed ? 1 : 0);
          if (compCount >= badge.reqTarget) shouldUnlock = true;
        }

        if (shouldUnlock) {
          triggerConfetti();
          showToast(`🏆 UNLOCKED BADGE: ${badge.title}! 🎉`, 'success');
          return { ...badge, unlocked: true };
        }

        return badge;
      })
    );
  };

  // Helper to sync user profile directly to MongoDB Atlas
  const registerUserInMongoDB = async (userData) => {
    if (!userData || !userData.email) return;
    const cleanEmail = userData.email.toLowerCase().trim();
    const userObj = {
      id: userData.id || userData.uid || `user-${Date.now()}`,
      email: cleanEmail,
      name: userData.name || cleanEmail.split('@')[0],
      handle: userData.handle || `@${cleanEmail.split('@')[0]}`,
      role: userData.role || (cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'),
      avatar: userData.avatar || null,
      level: userData.level || 1,
      title: userData.title || 'Novice Initiated',
      xp: userData.xp || 0,
      nextLevelXp: userData.nextLevelXp || 250,
      streak: userData.streak || 0,
      highestStreak: userData.highestStreak || 0,
      gender: userData.gender || 'unspecified'
    };
    setRegisteredUsers(prev => [userObj, ...prev.filter(u => u.email?.toLowerCase() !== cleanEmail && u.id !== userObj.id)]);
    await apiSaveUser(userObj);
  };

  // Listen to Real-Time Firebase Auth & Firestore Sync
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setAuthLoading(false);
        if (fbUser) {
          setCurrentUser(fbUser);
          const emailLower = fbUser.email ? fbUser.email.toLowerCase() : '';
          const isAdmin = emailLower === ADMIN_EMAIL.toLowerCase();

          if (isAdmin) {
            setCurrentUserRole('admin');
            setRole('admin');
            const adminData = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email || 'Admin Commander',
              avatar: fbUser.photoURL || admin.avatar,
              role: 'admin',
              email: fbUser.email
            };
            setAdmin(prev => ({ ...prev, ...adminData }));
            saveUserProfileToCloud(fbUser.uid, adminData);
            registerUserInMongoDB(adminData);
            showToast(`Authenticated as Admin Portal (${fbUser.email})`, 'success');
          } else {
            setCurrentUserRole('user');
            setRole('user');
            const userData = {
              id: fbUser.uid,
              name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Member User'),
              handle: `@${(fbUser.email || 'user').split('@')[0]}`,
              avatar: fbUser.photoURL || user.avatar,
              role: 'user',
              email: fbUser.email
            };
            setUser(prev => ({ ...prev, ...userData }));
            saveUserProfileToCloud(fbUser.uid, userData);
            registerUserInMongoDB(userData);
            setActiveTab('dashboard');
            showToast(`Authenticated as Routine Member (${fbUser.email})`, 'success');
          }
        } else {
          setCurrentUser(null);
          setCurrentUserRole('guest');
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Auth state listener warning:", e);
      setAuthLoading(false);
    }
  }, []);

  // Sync MongoDB Backend API with Real-time Live Polling & Auto-User Registration
  useEffect(() => {
    const syncMongoDB = async () => {
      const dbTasks = await apiFetchTasks();
      if (Array.isArray(dbTasks)) setTasks(dbTasks);

      const dbProofs = await apiFetchProofs();
      if (Array.isArray(dbProofs)) setProofs(dbProofs);

      const dbUsers = await apiFetchUsers();
      if (Array.isArray(dbUsers)) {
        setRegisteredUsers(dbUsers);

        // Ensure active currentUser (e.g. Gmail login) is saved in MongoDB Atlas
        if (currentUser && currentUser.email) {
          const cEmail = currentUser.email.toLowerCase().trim();
          const exists = dbUsers.some(u => u.email?.toLowerCase() === cEmail);
          if (!exists) {
            registerUserInMongoDB({
              id: currentUser.uid,
              email: cEmail,
              name: currentUser.displayName || cEmail.split('@')[0],
              handle: `@${cEmail.split('@')[0]}`,
              avatar: currentUser.photoURL || null
            });
          }
        }
      }

      const dbSettings = await apiFetchAdminSettings();
      if (dbSettings) {
        if (dbSettings.motivationalCategory) setMotivationalCategory(dbSettings.motivationalCategory);
        if (dbSettings.userTonePreferences) setUserTonePreferences(dbSettings.userTonePreferences);
      }
    };

    syncMongoDB();
    const interval = setInterval(syncMongoDB, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Admin Method to Set Individual User Tone Preference
  const setUserTonePreference = (userKey, toneId) => {
    const updated = { ...userTonePreferences, [userKey]: toneId };
    setUserTonePreferences(updated);
    saveAdminSettingsToCloud({ userTonePreferences: { [userKey]: toneId } });
    apiSaveAdminSettings({ motivationalCategory, userTonePreferences: updated });
    showToast(`Assigned ${MOTIVATIONAL_CATEGORIES[toneId]?.title || toneId} tone to ${userKey}! ✨`, 'info');
  };

  // Generate Procedurally Unique Non-Repeating Motivational Message for Current User
  const triggerMotivationalPopup = () => {
    const userKey = currentUser?.email || user.handle || user.name;
    const assignedToneKey = userTonePreferences[userKey] || userTonePreferences[user.handle] || motivationalCategory || 'hard';
    const categoryConfig = MOTIVATIONAL_CATEGORIES[assignedToneKey] || MOTIVATIONAL_CATEGORIES.hard;
    const nameStr = user.name || 'Member';
    const streakStr = Math.max(1, user.streak);

    const userGender = user.gender || 'unspecified';
    const uniqueMsg = generateUniqueMotivationalMessage(assignedToneKey, nameStr, streakStr, userGender);

    setStreakModalMessage({
      message: uniqueMsg,
      category: categoryConfig,
      date: new Date().toLocaleDateString(),
    });
  };

  // Admin Tone Change Trigger
  const updateMotivationalCategory = (newCat) => {
    setMotivationalCategory(newCat);
    localStorage.setItem('newself_global_tone', newCat);
    saveAdminSettingsToCloud({ motivationalCategory: newCat });
    apiSaveAdminSettings({ motivationalCategory: newCat, userTonePreferences });
    showToast(`Global Default Tone Category set to "${MOTIVATIONAL_CATEGORIES[newCat]?.title}" 🔥`, 'info');
  };

  // Live Dynamic Streak Counter Updater
  const checkAndUpdateStreak = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    setUser(prev => {
      if (prev.lastActiveDate === todayStr) {
        return prev;
      }

      let newStreak = prev.streak || 0;
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak = newStreak + 1;
      } else {
        newStreak = Math.max(1, newStreak === 0 ? 1 : newStreak + 1);
      }

      const newHighest = Math.max(prev.highestStreak || 0, newStreak);
      const updatedUser = {
        ...prev,
        streak: newStreak,
        highestStreak: newHighest,
        lastActiveDate: todayStr,
      };

      if (currentUser?.uid) {
        saveUserProfileToCloud(currentUser.uid, updatedUser);
      }

      showToast(`🔥 STREAK INCREMENTED! ${newStreak}-Day Momentum Active!`, 'success');
      return updatedUser;
    });
  };

  // Add XP and Check for Level Up
  const addXP = (earnedXp) => {
    setUser(prev => {
      const oldXp = prev.xp;
      const newXp = oldXp + earnedXp;
      const oldLvl = getLevelInfo(oldXp);
      const newLvl = getLevelInfo(newXp);

      if (newLvl.level > oldLvl.level) {
        triggerConfetti();
        showToast(`🎉 LEVEL UP! You reached Level ${newLvl.level}: ${newLvl.title}! 🔥`, 'success');
      }

      checkAndUnlockBadges(tasks, proofs, newXp, prev.streak);

      return {
        ...prev,
        xp: newXp,
        level: newLvl.level,
        title: newLvl.title,
        nextLevelXp: newLvl.maxXp,
      };
    });
  };

  // Task Completion Toggle
  const toggleTaskComplete = (taskId) => {
    setTasks(prevTasks => {
      let updatedCompletions = { ...taskCompletions };
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const nextState = !task.completed;
          const nextVal = nextState ? task.targetValue : 0;
          if (nextState) {
            triggerConfetti();
            addXP(task.points);
            checkAndUpdateStreak();
            triggerMotivationalPopup();
            updatedCompletions = {
              ...updatedCompletions,
              [taskId]: (updatedCompletions[taskId] || 0) + 1,
            };
          }
          return {
            ...task,
            completed: nextState,
            currentValue: nextVal,
          };
        }
        return task;
      });

      setTaskCompletions(updatedCompletions);
      checkAndUnlockBadges(updatedTasks, proofs, user.xp, user.streak, updatedCompletions);
      return updatedTasks;
    });
  };

  // Update Task Progress Numeric Value
  const updateTaskProgress = (taskId, value) => {
    setTasks(prevTasks => {
      let updatedCompletions = { ...taskCompletions };
      const updatedTasks = prevTasks.map(task => {
        if (task.id === taskId) {
          const numericVal = Math.min(Math.max(0, value), task.targetValue * 1.5);
          const isDone = numericVal >= task.targetValue;
          if (isDone && !task.completed) {
            triggerConfetti();
            addXP(task.points);
            checkAndUpdateStreak();
            triggerMotivationalPopup();
            updatedCompletions = {
              ...updatedCompletions,
              [taskId]: (updatedCompletions[taskId] || 0) + 1,
            };
          }
          return {
            ...task,
            currentValue: numericVal,
            completed: isDone,
          };
        }
        return task;
      });

      setTaskCompletions(updatedCompletions);
      checkAndUnlockBadges(updatedTasks, proofs, user.xp, user.streak, updatedCompletions);
      return updatedTasks;
    });
  };

  // Admin Task Creation + REAL-TIME SPECIALIZED BADGE SET GENERATOR!
  const addNewTask = (newTask) => {
    const difficultyLevel = newTask.difficulty || 'Medium';
    const calculatedXp = DIFFICULTY_XP_MAP[difficultyLevel] || 120;

    const taskObj = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      category: newTask.category || 'Fitness',
      difficulty: difficultyLevel,
      assignedTo: newTask.assignedTo || 'all',
      requiresProof: newTask.requiresProof ?? true,
      completed: false,
      currentValue: 0,
      targetValue: Number(newTask.targetValue) || 1,
      unit: newTask.unit || 'times',
      icon: newTask.icon || 'Zap',
      points: calculatedXp,
      proofStatus: 'none',
      description: newTask.description || '',
    };

    // Generate Specialized Live Set of Badges for this specific Task!
    const isStepTask = (taskObj.unit && taskObj.unit.toLowerCase().includes('step')) ||
                       (taskObj.title && taskObj.title.toLowerCase().includes('step')) ||
                       taskObj.targetValue >= 1000;

    const shortTitle = taskObj.title.length > 18 ? taskObj.title.substring(0, 18) + '...' : taskObj.title;

    const specializedBadgeSet = [
      {
        id: `badge-spec-${taskObj.id}-1`,
        title: `${shortTitle} Initiate`,
        icon: isStepTask ? '👟' : '🐣',
        category: 'Specialized Tasks',
        rarity: 'Specialized',
        description: `Complete specialized habit '${taskObj.title}' (${taskObj.targetValue} ${taskObj.unit}) for the 1st time.`,
        unlocked: false,
        reqType: 'specializedTask',
        taskId: taskObj.id,
        reqTarget: 1,
      },
      {
        id: `badge-spec-${taskObj.id}-2`,
        title: `${shortTitle} Specialist`,
        icon: isStepTask ? '🏃' : '🦊',
        category: 'Specialized Tasks',
        rarity: 'Rare',
        description: `Complete specialized habit '${taskObj.title}' 10 times.`,
        unlocked: false,
        reqType: 'specializedTask',
        taskId: taskObj.id,
        reqTarget: 10,
      },
      {
        id: `badge-spec-${taskObj.id}-3`,
        title: `${shortTitle} Hardcore Titan`,
        icon: isStepTask ? '⚡' : '💎',
        category: 'Specialized Tasks',
        rarity: 'Epic',
        description: `Achieve 50 total completions of specialized habit '${taskObj.title}'! True hardcore dedication.`,
        unlocked: false,
        reqType: 'specializedTask',
        taskId: taskObj.id,
        reqTarget: 50,
      },
      {
        id: `badge-spec-${taskObj.id}-4`,
        title: `${shortTitle} 100x Sovereign`,
        icon: isStepTask ? '🌌' : '👑',
        category: 'Specialized Tasks',
        rarity: 'Legendary',
        description: `Achieve 100 completions of specialized habit '${taskObj.title}'! Legendary routine mastery.`,
        unlocked: false,
        reqType: 'specializedTask',
        taskId: taskObj.id,
        reqTarget: 100,
      },
    ];

    setTasks(prev => [taskObj, ...prev]);
    setBadges(prev => [...prev, ...specializedBadgeSet]);

    if (currentUser?.uid) {
      saveTaskToCloud(currentUser.uid, taskObj);
    }
    apiSaveTask(taskObj);

    const recipientLabel = taskObj.assignedTo === 'all' ? 'All Members' : taskObj.assignedTo;
    showToast(`New ${difficultyLevel} Habit & 3 Live Specialized Badges Created for [${recipientLabel}]! 🌟`);
  };

  const updateTask = (taskId, updatedData) => {
    const difficultyLevel = updatedData.difficulty || 'Medium';
    const calculatedXp = DIFFICULTY_XP_MAP[difficultyLevel] || 120;

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedObj = {
          ...task,
          ...updatedData,
          targetValue: Number(updatedData.targetValue) || 1,
          points: calculatedXp,
        };
        if (currentUser?.uid) {
          saveTaskToCloud(currentUser.uid, updatedObj);
        }
        apiUpdateTask(taskId, updatedObj);
        return updatedObj;
      }
      return task;
    }));

    showToast('Habit updated successfully by Admin.', 'success');
  };

  const addUserTask = addNewTask;


  // Submit Proof for Task
  const submitProof = (taskId, imageUrl, caption) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const newProof = {
      id: `proof-${Date.now()}`,
      taskId: targetTask.id,
      taskTitle: targetTask.title,
      userName: user.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Member'),
      userEmail: currentUser?.email || user.email || '',
      userAvatar: user.avatar,
      imageUrl: imageUrl || targetTask.proofUrl,
      submittedAt: 'Just now',
      caption: caption || 'Submitted task proof for verification.',
      status: 'pending',
      category: targetTask.category,
    };

    const updatedProofs = [newProof, ...proofs];
    setProofs(updatedProofs);
    saveProofToCloud(newProof);
    apiSaveProof(newProof);

    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, proofStatus: 'pending', proofUrl: newProof.imageUrl, completed: false } : t))
    );

    setAdminStats(prev => ({
      ...prev,
      pendingVerifications: prev.pendingVerifications + 1,
    }));

    showToast('Photo proof submitted! Pending Admin Verification.', 'info');
    setActiveUploadTask(null);
  };

  // Admin Proof Approval
  const approveProof = (proofId) => {
    const targetProof = proofs.find(p => p.id === proofId);
    if (!targetProof) return;

    const approvedProofObj = { ...targetProof, status: 'approved' };
    const updatedProofs = proofs.map(p => (p.id === proofId ? approvedProofObj : p));
    setProofs(updatedProofs);
    saveProofToCloud(approvedProofObj);
    apiUpdateProof(proofId, approvedProofObj);
    checkAndUpdateStreak();

    setTasks(prev =>
      prev.map(t => (t.id === targetProof.taskId ? { ...t, proofStatus: 'approved', completed: true, currentValue: t.targetValue } : t))
    );

    setAdminStats(prev => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
      approvedToday: prev.approvedToday + 1,
    }));

    checkAndUnlockBadges(tasks, updatedProofs, user.xp, user.streak);
    triggerConfetti();
    showToast(`Proof Approved for ${targetProof.userName}! ✨`);
  };

  // Admin Proof Rejection
  const rejectProof = (proofId, reason = 'Proof image blurred or invalid.') => {
    const targetProof = proofs.find(p => p.id === proofId);
    if (!targetProof) return;

    const rejectedProofObj = { ...targetProof, status: 'rejected', rejectReason: reason };

    setProofs(prev =>
      prev.map(p => (p.id === proofId ? rejectedProofObj : p))
    );
    saveProofToCloud(rejectedProofObj);
    apiUpdateProof(proofId, rejectedProofObj);

    setTasks(prev =>
      prev.map(t => (t.id === targetProof.taskId ? { ...t, proofStatus: 'rejected', completed: false } : t))
    );

    setAdminStats(prev => ({
      ...prev,
      pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
    }));

    showToast(`Proof Rejected for ${targetProof.userName}`, 'error');
  };

  const deleteProof = (proofId) => {
    setProofs(prev => prev.filter(p => p.id !== proofId));
    deleteProofFromCloud(proofId);
    apiDeleteProof(proofId);
    showToast('Proof submission deleted permanently.', 'info');
  };

  const deleteUser = (userId) => {
    const keyLower = String(userId).toLowerCase();
    setRegisteredUsers(prev => prev.filter(u => 
      u.id !== userId && 
      u.email?.toLowerCase() !== keyLower && 
      u.name?.toLowerCase() !== keyLower &&
      u.handle?.toLowerCase() !== keyLower
    ));

    setUserTonePreferences(prev => {
      const next = { ...prev };
      delete next[userId];
      delete next[keyLower];
      apiSaveAdminSettings({ motivationalCategory, userTonePreferences: next });
      return next;
    });

    deleteUserFromCloud(userId);
    apiDeleteUser(userId);
    showToast(`Member profile "${userId}" removed permanently from system.`, 'info');
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setProofs(prev => prev.filter(p => p.taskId !== taskId));
    setBadges(prev => prev.filter(b => b.taskId !== taskId));

    if (currentUser?.uid) {
      deleteTaskFromCloud(currentUser.uid, taskId);
    }
    apiDeleteTask(taskId);
    showToast('Habit deleted from system by Admin.', 'info');
  };



  // Calculate overall progress
  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const dailyProgressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const levelInfo = getLevelInfo(user.xp);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentUserRole,
        ADMIN_EMAIL,
        authLoading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logoutUser,
        role,
        user,
        setUser,
        levelInfo,
        addXP,
        admin,
        tasks,
        proofs,
        deleteProof,
        registeredUsers,
        deleteUser,
        badges,
        getBadgeProgress,
        taskCompletions,
        adminStats,
        userTonePreferences,
        setUserTonePreference,
        motivationalCategory,
        setMotivationalCategory: updateMotivationalCategory,
        streakModalMessage,
        setStreakModalMessage,
        triggerMotivationalPopup,
        selectedCategory,
        setSelectedCategory,
        activeUploadTask,
        setActiveUploadTask,
        activeTab,
        setActiveTab,
        toastMessage,
        showToast,
        triggerConfetti,
        toggleTaskComplete,
        updateTaskProgress,
        addUserTask,
        submitProof,
        approveProof,
        rejectProof,
        addNewTask,
        deleteTask,
        registerUserInMongoDB,
        dailyProgressPercent,
        completedCount,
        totalTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
