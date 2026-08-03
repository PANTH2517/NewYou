import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Award, Zap, Sparkles, Trophy, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

export const StreakBanner = () => {
  const { user, tasks, badges, triggerConfetti, levelInfo } = useApp();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const jsDay = now.getDay();
  // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
  const currentDayIdx = jsDay === 0 ? 6 : jsDay - 1;
  const todayHasCompleted = tasks.some(t => t.completed);

  const weeklyDays = daysOfWeek.map((day, idx) => {
    const isToday = idx === currentDayIdx;
    let completed = false;
    if (isToday) {
      completed = todayHasCompleted;
    } else if (idx < currentDayIdx) {
      const daysAgo = currentDayIdx - idx;
      completed = user.streak >= daysAgo;
    }
    return { day, completed, isToday };
  });

  return (
    <TiltCard maxTilt={6} className="w-full mb-8">
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-dark-border overflow-hidden bg-gradient-to-r from-dark-card via-dark-surface to-dark-bg">
        
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-fire/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Streak Counter & Momentum Meter */}
          <div className="lg:col-span-5 flex items-center space-x-6">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-orange-fire to-amber-400 p-1 shadow-orange-glow">
              <div className="w-full h-full bg-dark-bg rounded-[22px] flex flex-col items-center justify-center p-2 text-center">
                <Flame className="w-10 h-10 text-orange-fire animate-flame-flicker" />
                <span className="text-xl sm:text-2xl font-extrabold text-white leading-none mt-1">{user.streak}</span>
                <span className="text-[9px] font-bold text-orange-fire uppercase tracking-widest mt-0.5">DAYS</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-fire/15 border border-orange-fire/40 text-orange-fire text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Level {levelInfo.level}: {levelInfo.title}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                {user.streak} Day Momentum
              </h2>

              {/* Dynamic Level XP Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-400">Level Progression</span>
                  <span className="text-cyan-glow">{user.xp} / {levelInfo.maxXp} XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-dark-bg overflow-hidden border border-dark-border">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-glow via-purple-neon to-orange-fire transition-all duration-500 rounded-full"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Consistency Matrix & Badges Ribbon */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-300">
                <Calendar className="w-4 h-4 text-cyan-glow" />
                <span>This Week's Activity Matrix</span>
              </div>
              
              <button
                onClick={triggerConfetti}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-fire to-amber-500 text-white text-xs font-extrabold shadow-orange-glow hover:scale-105 active:scale-95 transition-all"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Celebrate Streak 🎉</span>
              </button>
            </div>

            {/* Week Pills */}
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {weeklyDays.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-2.5 rounded-2xl border transition-all ${
                    item.completed
                      ? 'bg-orange-fire/15 border-orange-fire/50 text-orange-fire shadow-sm'
                      : item.isToday
                      ? 'bg-cyan-glow/15 border-cyan-glow text-cyan-glow animate-pulse'
                      : 'bg-dark-card border-dark-border text-gray-500'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{item.day}</span>
                  <div className="mt-1.5">
                    {item.completed ? (
                      <Flame className="w-5 h-5 text-orange-fire animate-flame-flicker" />
                    ) : item.isToday ? (
                      <Zap className="w-5 h-5 text-cyan-glow" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-dark-border" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Badges Ribbon */}
            <div className="flex items-center space-x-2.5 overflow-x-auto pt-1 no-scrollbar">
              <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Badges:</span>
              </span>
              {badges.slice(0, 6).map(badge => (
                <div
                  key={badge.id}
                  onClick={() => badge.unlocked && triggerConfetti()}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs whitespace-nowrap transition-all ${
                    badge.unlocked
                      ? 'bg-dark-bg/90 border-cyan-glow/50 text-white shadow-cyan-glow/20 cursor-pointer hover:scale-105'
                      : 'bg-dark-bg/50 border-dark-border text-gray-500 opacity-70'
                  }`}
                >
                  <span>{badge.icon || '🏆'}</span>
                  <span className="font-bold text-[11px]">{badge.title}</span>
                  {!badge.unlocked && <Lock className="w-3 h-3 text-gray-500 ml-0.5" />}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </TiltCard>
  );
};
