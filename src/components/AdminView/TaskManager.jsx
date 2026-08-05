import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Edit2, Footprints, Utensils, Droplets, BookOpen, Brain, Code, Zap, Camera, X, User, Flame, Calendar } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

const ICON_MAP = {
  Footprints,
  Utensils,
  Droplets,
  BookOpen,
  Brain,
  Code,
  Zap,
};

const AVAILABLE_ICONS = ['Footprints', 'Utensils', 'Droplets', 'BookOpen', 'Brain', 'Code', 'Zap'];

export const TaskManager = () => {
  const { tasks, addNewTask, updateTask, deleteTask, proofs, user, currentUser, registeredUsers } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fitness',
    difficulty: 'Medium',
    assignedTo: 'all',
    targetValue: 10,
    unit: 'times',
    icon: 'Zap',
    requiresProof: true,
    description: '',
    frequency: 'daily',
    selectedDays: [],
  });

  const registeredMembers = Array.from(new Set([
    ...registeredUsers.map(u => u.email || u.handle || u.name).filter(Boolean),
    ...(currentUser?.email ? [currentUser.email] : []),
    ...(user?.email ? [user.email] : []),
    ...proofs.map(p => p.userEmail || p.userName).filter(Boolean)
  ])).filter(email => email && email.toLowerCase() !== 'demo');

  const memberOptions = [
    { value: 'all', label: '🌐 All Members (Global System Task)' },
    ...registeredMembers.map(email => ({
      value: email.toLowerCase(),
      label: `👤 Registered Member (${email})`
    }))
  ];

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      category: 'Fitness',
      difficulty: 'Medium',
      assignedTo: 'all',
      targetValue: 10,
      unit: 'times',
      icon: 'Zap',
      requiresProof: true,
      description: '',
      frequency: 'daily',
      selectedDays: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTask(t);
    setFormData({
      title: t.title || '',
      category: t.category || 'Fitness',
      difficulty: t.difficulty || 'Medium',
      assignedTo: t.assignedTo || 'all',
      targetValue: t.targetValue || 10,
      unit: t.unit || 'times',
      icon: t.icon || 'Zap',
      requiresProof: t.requiresProof ?? true,
      description: t.description || '',
      frequency: t.frequency || 'daily',
      selectedDays: t.selectedDays || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addNewTask(formData);
    }

    setEditingTask(null);
    setFormData({
      title: '',
      category: 'Fitness',
      difficulty: 'Medium',
      assignedTo: 'all',
      targetValue: 10,
      unit: 'times',
      icon: 'Zap',
      requiresProof: true,
      description: '',
    });
    setIsModalOpen(false);
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-neon/15 text-emerald-neon border border-emerald-neon/40 text-[10px] font-extrabold shrink-0"><span>🟢 Easy</span> <span className="opacity-80">(+80 XP)</span></span>;
      case 'Hard':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-[10px] font-extrabold shrink-0"><span>🔴 Hard</span> <span className="opacity-80">(+200 XP)</span></span>;
      case 'Extreme':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold animate-pulse shrink-0"><span>⚡ Extreme</span> <span className="opacity-80">(+350 XP)</span></span>;
      case 'Medium':
      default:
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/40 text-[10px] font-extrabold shrink-0"><span>🟡 Medium</span> <span className="opacity-80">(+120 XP)</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Admin Task CRUD Portal</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-fire/15 text-orange-fire border border-orange-fire/30">
              {tasks.length} Habits Configured
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure system habit targets, step challenges, and member assignments. Every new habit automatically generates 3 live specialized badges in real-time! 🌟
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-fire to-amber-500 text-white font-extrabold text-xs shadow-orange-glow hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New System Habit</span>
        </button>
      </div>

      {/* Task CRUD Table */}
      <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-dark-bg/90 border-b border-dark-border text-gray-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Habit Target</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Assigned Target</th>
                <th className="py-3.5 px-3">Target Steps/Value</th>
                <th className="py-3.5 px-3">Difficulty & XP</th>
                <th className="py-3.5 px-3">Proof Mode</th>
                <th className="py-3.5 px-4 text-center sticky right-0 bg-[#0B0F17] z-10 border-l border-dark-border shadow-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/60">
              {tasks.map(t => {
                const IconComp = ICON_MAP[t.icon] || Zap;
                const recipientLabel = t.assignedTo === 'all' || !t.assignedTo ? '🌐 All Members' : `👤 ${t.assignedTo}`;

                return (
                  <tr key={t.id} className="hover:bg-dark-card/60 transition-colors">
                    
                    {/* Habit Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-fire/10 border border-orange-fire/30 flex items-center justify-center text-orange-fire shrink-0">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-sm">{t.title}</div>
                          <div className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]">{t.description}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 font-bold text-gray-300">
                      {t.category}
                    </td>

                    {/* Assigned Recipient Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        t.assignedTo === 'all' || !t.assignedTo
                          ? 'bg-cyan-glow/10 text-cyan-glow border-cyan-glow/30'
                          : 'bg-purple-900/30 text-purple-300 border-purple-500/40'
                      }`}>
                        <span>{recipientLabel}</span>
                      </span>
                    </td>

                    {/* Target Steps / Threshold */}
                    <td className="py-3.5 px-3 font-semibold text-gray-200">
                      {t.targetValue} {t.unit}
                    </td>

                    {/* Difficulty Badge (Calculated XP) */}
                    <td className="py-3.5 px-3">
                      {getDifficultyBadge(t.difficulty || 'Medium')}
                    </td>

                    {/* Proof Toggle */}
                    <td className="py-3.5 px-3">
                      {t.requiresProof ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold">
                          <Camera className="w-3 h-3" />
                          <span>Mandatory Photo</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-gray-500/15 text-gray-400 border border-gray-500/30 text-[10px] font-bold">
                          <span>Self Log</span>
                        </span>
                      )}
                    </td>

                    {/* Edit & Delete Actions (Sticky Right Opaque) */}
                    <td className="py-3.5 px-4 text-center sticky right-0 bg-[#0B0F17] z-10 border-l border-dark-border">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-glow/15 border border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/25 transition-all text-xs font-bold flex items-center space-x-1"
                          title="Edit Task Settings"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => deleteTask(t.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 transition-all text-xs font-bold flex items-center space-x-1"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Task Creation / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-dark-border/90 p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-5 shrink-0">
              <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
                <span>{editingTask ? 'Edit System Habit' : 'Create System Habit'}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30">
                  Admin Panel
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
              
              {/* Row 1: Habit Title & Assign To (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Habit Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Hit 10,000 Steps Daily"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-orange-fire mb-1 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Assign To Member</span>
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-bg border border-orange-fire/50 text-white text-xs font-bold focus:outline-none focus:border-orange-fire cursor-pointer"
                  >
                    {memberOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Difficulty Tier & Schedule Frequency (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border">
                  <label className="block text-xs font-bold text-cyan-glow mb-1 flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Difficulty Tier (XP Reward)</span>
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-white text-xs font-bold focus:outline-none focus:border-cyan-glow cursor-pointer"
                  >
                    <option value="Easy">🟢 Easy (80 XP Reward)</option>
                    <option value="Medium">🟡 Medium (120 XP Reward)</option>
                    <option value="Hard">🔴 Hard (200 XP Reward)</option>
                    <option value="Extreme">⚡ Extreme / Iron Will (350 XP)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border">
                  <label className="block text-xs font-bold text-emerald-400 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule & Frequency</span>
                  </label>
                  <select
                    value={formData.frequency || 'daily'}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-white text-xs font-bold focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="daily">⚡ Daily Routine (Everyday)</option>
                    <option value="weekly">📅 Weekly Target (Once/Week)</option>
                    <option value="specific_days">🗓️ Specific Days (Select Days)</option>
                  </select>
                </div>
              </div>

              {/* Conditional Specific Days Pills */}
              {formData.frequency === 'specific_days' && (
                <div className="p-3 rounded-xl bg-dark-bg border border-emerald-500/30">
                  <label className="block text-[11px] font-bold text-emerald-300 mb-2">Select Active Routine Days:</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                      const isSelected = (formData.selectedDays || []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            const curr = formData.selectedDays || [];
                            const next = isSelected ? curr.filter(d => d !== day) : [...curr, day];
                            setFormData({ ...formData, selectedDays: next });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-500/20'
                              : 'bg-dark-card text-gray-400 border-dark-border hover:border-gray-500'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Row 3: Category & Icon Symbol (2 columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire cursor-pointer"
                  >
                    <option value="Fitness">Fitness</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Icon Symbol</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire cursor-pointer"
                  >
                    {AVAILABLE_ICONS.map(ico => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Target Value & Unit (2 columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Target Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. steps / mins"
                    className="w-full px-3 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire"
                  />
                </div>
              </div>

              {/* Row 5: Mandatory Photo Toggle */}
              <div className="p-3.5 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Require Photo / Screenshot Proof</div>
                  <div className="text-[11px] text-gray-400">User must upload proof image to complete task</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.requiresProof}
                  onChange={(e) => setFormData({ ...formData, requiresProof: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 text-orange-fire focus:ring-orange-fire cursor-pointer"
                />
              </div>

              {/* Row 6: Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description / Guidelines</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Upload smartwatch screenshot showing 10k steps."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-orange-fire"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-dark-border shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-300 hover:text-white font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-fire to-amber-500 text-dark-bg font-extrabold text-xs hover:shadow-orange-fire transition-all"
                >
                  {editingTask ? 'Save Changes' : 'Create Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
