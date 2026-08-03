import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Footprints, Utensils, Brain, Zap, ShieldCheck, Award, Sparkles, TrendingUp } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

export const InsightsRings = () => {
  const { tasks, proofs, user, levelInfo, dailyProgressPercent } = useApp();

  // Filter tasks visible to user
  const fitnessTasks = tasks.filter(t => t.category === 'Fitness');
  const nutritionTasks = tasks.filter(t => t.category === 'Nutrition');
  const mindfulnessTasks = tasks.filter(t => t.category === 'Mindfulness' || t.category === 'Growth');

  const calcCategoryPercent = (catTasks) => {
    if (!catTasks || catTasks.length === 0) return 0;
    const completed = catTasks.filter(t => t.completed).length;
    return Math.round((completed / catTasks.length) * 100);
  };

  const fitnessPercent = calcCategoryPercent(fitnessTasks);
  const nutritionPercent = calcCategoryPercent(nutritionTasks);
  const mindfulnessPercent = calcCategoryPercent(mindfulnessTasks);

  const fitnessCompleted = fitnessTasks.filter(t => t.completed).length;
  const nutritionCompleted = nutritionTasks.filter(t => t.completed).length;
  const mindfulnessCompleted = mindfulnessTasks.filter(t => t.completed).length;

  const verifiedProofsCount = proofs.filter(p => p.status === 'approved').length;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Progress Insights & Telemetry</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">
              Live Real-Time Analytics
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Visual ring analytics tracking habit completion dynamically across fitness, nutrition, mindfulness, and growth goals.
          </p>
        </div>
      </div>

      {/* Dynamic 4 Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Ring 1: Overall Daily Routine */}
        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-3xl p-6 border border-dark-border flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-dark-card to-dark-bg">
            <div className="relative w-24 h-24 flex items-center justify-center my-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#1E232B" strokeWidth="6" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#00F0FF"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - dailyProgressPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Activity className="w-5 h-5 text-cyan-glow mb-0.5" />
                <span className="text-base font-extrabold text-white">{dailyProgressPercent}%</span>
              </div>
            </div>
            <h4 className="font-extrabold text-white text-sm mt-1">Daily Routine</h4>
            <p className="text-xs text-gray-400 font-medium">
              {tasks.filter(t => t.completed).length} / {tasks.length} Habits Done
            </p>
          </div>
        </TiltCard>

        {/* Ring 2: Fitness Category */}
        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-3xl p-6 border border-dark-border flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-dark-card to-dark-bg">
            <div className="relative w-24 h-24 flex items-center justify-center my-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#1E232B" strokeWidth="6" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#FF6B00"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - fitnessPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Footprints className="w-5 h-5 text-orange-fire mb-0.5" />
                <span className="text-base font-extrabold text-white">{fitnessPercent}%</span>
              </div>
            </div>
            <h4 className="font-extrabold text-white text-sm mt-1">Fitness Goals</h4>
            <p className="text-xs text-gray-400 font-medium">
              {fitnessCompleted} / {fitnessTasks.length} Fitness Habits
            </p>
          </div>
        </TiltCard>

        {/* Ring 3: Nutrition Category */}
        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-3xl p-6 border border-dark-border flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-dark-card to-dark-bg">
            <div className="relative w-24 h-24 flex items-center justify-center my-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#1E232B" strokeWidth="6" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#00E676"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - nutritionPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Utensils className="w-5 h-5 text-emerald-neon mb-0.5" />
                <span className="text-base font-extrabold text-white">{nutritionPercent}%</span>
              </div>
            </div>
            <h4 className="font-extrabold text-white text-sm mt-1">Nutrition Habits</h4>
            <p className="text-xs text-gray-400 font-medium">
              {nutritionCompleted} / {nutritionTasks.length} Meals & Fluid
            </p>
          </div>
        </TiltCard>

        {/* Ring 4: Mindfulness & Growth */}
        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-3xl p-6 border border-dark-border flex flex-col items-center text-center relative overflow-hidden bg-gradient-to-b from-dark-card to-dark-bg">
            <div className="relative w-24 h-24 flex items-center justify-center my-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="38" stroke="#1E232B" strokeWidth="6" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  stroke="#9D4EDD"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - mindfulnessPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Brain className="w-5 h-5 text-purple-neon mb-0.5" />
                <span className="text-base font-extrabold text-white">{mindfulnessPercent}%</span>
              </div>
            </div>
            <h4 className="font-extrabold text-white text-sm mt-1">Mindfulness & Growth</h4>
            <p className="text-xs text-gray-400 font-medium">
              {mindfulnessCompleted} / {mindfulnessTasks.length} Growth Habits
            </p>
          </div>
        </TiltCard>

      </div>

      {/* Telemetry Footer Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-dark-border flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total XP Earned</div>
            <div className="text-2xl font-extrabold text-white">{user.xp} XP</div>
            <div className="text-[11px] text-cyan-glow font-medium mt-0.5">Next Level: {levelInfo.maxXp} XP</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-dark-border flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-emerald-neon/10 text-emerald-neon border border-emerald-neon/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verified Proofs</div>
            <div className="text-2xl font-extrabold text-white">{verifiedProofsCount} Approved</div>
            <div className="text-[11px] text-emerald-neon font-medium mt-0.5">Live Media Verifications</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-dark-border flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-orange-fire/10 text-orange-fire border border-orange-fire/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Routine Consistency</div>
            <div className="text-2xl font-extrabold text-white">{dailyProgressPercent}%</div>
            <div className="text-[11px] text-orange-fire font-medium mt-0.5">Real-Time Daily Score</div>
          </div>
        </div>
      </div>

    </div>
  );
};
