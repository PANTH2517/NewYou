import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Camera, 
  Footprints, 
  Utensils, 
  Droplets, 
  BookOpen, 
  Brain, 
  Code, 
  Zap, 
  Clock, 
  Check, 
  Sparkles,
  ShieldCheck,
  AlertCircle,
  User,
  Flame,
  Calendar
} from 'lucide-react';

const ICON_MAP = {
  Footprints,
  Utensils,
  Droplets,
  BookOpen,
  Brain,
  Code,
  Zap,
};

export const TaskFeed = () => {
  const {
    tasks,
    selectedCategory,
    setSelectedCategory,
    toggleTaskComplete,
    setActiveUploadTask,
    currentUser,
    user,
  } = useApp();

  const categories = ['All', 'Fitness', 'Nutrition', 'Mindfulness', 'Growth'];

  const userKey = currentUser?.email ? currentUser.email.toLowerCase() : (user.handle || '@member');
  const userHandleLower = (user.handle || '').toLowerCase();
  const userNameLower = (user.name || '').toLowerCase();
  const userEmailLower = (currentUser?.email || '').toLowerCase();

  const visibleTasks = tasks.filter(task => {
    if (!task.assignedTo || task.assignedTo === 'all') return true;
    const targetLower = task.assignedTo.toLowerCase();
    return (
      targetLower === userKey ||
      targetLower === userHandleLower ||
      targetLower === userNameLower ||
      (userEmailLower && targetLower === userEmailLower) ||
      targetLower === '@member'
    );
  });

  const filteredTasks = selectedCategory === 'All'
    ? visibleTasks
    : visibleTasks.filter(t => t.category === selectedCategory);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-neon/15 text-emerald-neon border border-emerald-neon/40 text-[10px] font-extrabold shrink-0">🟢 Easy</span>;
      case 'Hard':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/40 text-[10px] font-extrabold shrink-0">🔴 Hard</span>;
      case 'Extreme':
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold animate-pulse shrink-0">⚡ Extreme</span>;
      case 'Medium':
      default:
        return <span className="whitespace-nowrap inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/40 text-[10px] font-extrabold shrink-0">🟡 Medium</span>;
    }
  };

  const getFrequencyBadge = (task) => {
    if (task.frequency === 'weekly') {
      return (
        <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/40 text-indigo-300 text-[10px] font-extrabold flex items-center space-x-1 shrink-0">
          <Calendar className="w-3 h-3 text-indigo-400" />
          <span>Weekly Habit</span>
        </span>
      );
    }
    if (task.frequency === 'specific_days' && task.selectedDays && task.selectedDays.length > 0) {
      return (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold flex items-center space-x-1 shrink-0">
          <Calendar className="w-3 h-3 text-emerald-400" />
          <span>{task.selectedDays.join(', ')}</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-[10px] font-extrabold flex items-center space-x-1 shrink-0">
        <Zap className="w-3 h-3 text-cyan-glow" />
        <span>Daily Target</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Category Pills & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Daily Target Checklist</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">
              {visibleTasks.filter(t => t.completed).length} / {visibleTasks.length} Completed
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Complete habit targets assigned to you by Admin to maintain your streak and earn XP rewards.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-glow text-dark-bg font-extrabold shadow-cyan-glow'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Feed Cards or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 sm:p-12 text-center border border-dark-border space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow mx-auto">
            <Zap className="w-7 h-7" />
          </div>
          <h4 className="text-xl font-display font-extrabold text-white">No Tasks Assigned for Current View</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
            There are currently no tasks assigned to you under the "{selectedCategory}" category. Habits are configured individually by Admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredTasks.map(task => {
            const TaskIcon = ICON_MAP[task.icon] || Zap;
            const progressPercent = Math.min(100, Math.round((task.currentValue / task.targetValue) * 100));
            const isPersonalTask = task.assignedTo && task.assignedTo !== 'all';

            return (
              <div
                key={task.id}
                className={`group relative glass-panel rounded-2xl p-5 border transition-all duration-300 ${
                  task.completed
                    ? 'border-emerald-neon/40 bg-emerald-neon/5'
                    : 'border-dark-border hover:border-cyan-glow/50 hover:bg-dark-card/80'
                }`}
              >
                
                {/* Card Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                        task.completed
                          ? 'bg-emerald-neon/15 border-emerald-neon text-emerald-neon'
                          : 'bg-cyan-glow/10 border-cyan-glow/30 text-cyan-glow'
                      }`}
                    >
                      <TaskIcon className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`font-bold text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        {isPersonalTask && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-900/30 border border-purple-500/40 text-purple-300 text-[10px] font-extrabold flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>Assigned to You</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {getDifficultyBadge(task.difficulty || 'Medium')}
                        {getFrequencyBadge(task)}
                        <span className="text-[11px] font-semibold text-gray-400">
                          {task.category} • +{task.points} XP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proof Status Badge */}
                  {task.requiresProof && (
                    <div className="flex items-center space-x-1">
                      {task.proofStatus === 'approved' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-neon/15 text-emerald-neon border border-emerald-neon/40 text-[10px] font-extrabold">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified Proof</span>
                        </span>
                      )}
                      {task.proofStatus === 'pending' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>Review Pending</span>
                        </span>
                      )}
                      {task.proofStatus === 'rejected' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/40 text-[10px] font-extrabold">
                          <AlertCircle className="w-3 h-3" />
                          <span>Re-upload Req</span>
                        </span>
                      )}
                      {task.proofStatus === 'none' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold">
                          <Camera className="w-3 h-3" />
                          <span>Proof Req</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-gray-400 mt-3 mb-4 leading-relaxed">
                  {task.description || 'System habit target configured by Admin.'}
                </p>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">Target Progress</span>
                    <span className={task.completed ? 'text-emerald-neon font-bold' : 'text-cyan-glow'}>
                      {task.currentValue} / {task.targetValue} {task.unit} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-dark-bg overflow-hidden border border-dark-border">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        task.completed
                          ? 'bg-gradient-to-r from-emerald-neon to-cyan-glow'
                          : 'bg-gradient-to-r from-cyan-glow to-orange-fire'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-3 border-t border-dark-border/60">
                  {task.proofUrl ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={task.proofUrl}
                        alt="Submitted Proof"
                        className="w-8 h-8 rounded-lg object-cover border border-cyan-glow/50 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setActiveUploadTask(task)}
                      />
                      <span className="text-[11px] text-cyan-glow font-medium underline cursor-pointer" onClick={() => setActiveUploadTask(task)}>
                        View Submission
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-500 font-medium">
                      {task.requiresProof ? 'Photo verification required' : 'Self-log enabled'}
                    </span>
                  )}

                  {task.requiresProof ? (
                    <button
                      onClick={() => setActiveUploadTask(task)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        task.completed && task.proofStatus === 'approved'
                          ? 'bg-dark-card text-emerald-neon border border-emerald-neon/30'
                          : task.proofStatus === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-gradient-to-r from-cyan-glow to-cyan-accent text-dark-bg hover:shadow-cyan-glow font-extrabold'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>
                        {task.proofStatus === 'pending'
                          ? 'Update Proof'
                          : task.completed
                          ? 'View Proof'
                          : 'Complete & Upload'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        task.completed
                          ? 'bg-emerald-neon/20 text-emerald-neon border border-emerald-neon/40'
                          : 'bg-dark-card border border-dark-border text-gray-200 hover:border-cyan-glow hover:text-cyan-glow'
                      }`}
                    >
                      {task.completed ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      <span>{task.completed ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
