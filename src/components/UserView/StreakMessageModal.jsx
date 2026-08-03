import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Flame, Heart, Zap, Sun, X, Trophy } from 'lucide-react';

export const StreakMessageModal = () => {
  const { streakModalMessage, setStreakModalMessage, user, triggerConfetti } = useApp();

  if (!streakModalMessage) return null;

  const { message, category } = streakModalMessage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-dark-border/90 p-6 sm:p-8 shadow-2xl overflow-hidden text-center">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-orange-fire/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setStreakModalMessage(null)}
          className="absolute top-5 right-5 p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category Header Badge */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-orange-fire to-amber-400 p-0.5 shadow-orange-glow mb-4">
            <div className="w-full h-full bg-dark-bg rounded-[22px] flex items-center justify-center text-2xl">
              {category.icon || '🔥'}
            </div>
          </div>

          <div className={`inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider mb-2 ${category.badgeClass}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{category.title}</span>
          </div>

          <h3 className="text-2xl font-display font-extrabold text-white">
            Daily Goal Accomplished!
          </h3>
        </div>

        {/* Personalized Message Container */}
        <div className="my-6 p-5 rounded-2xl bg-dark-card/80 border border-dark-border/80 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl">
            {category.icon}
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed italic">
            "{message}"
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => {
              triggerConfetti();
              setStreakModalMessage(null);
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-fire to-amber-500 text-white font-extrabold text-xs shadow-orange-glow hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Keep Up the Momentum 🔥</span>
          </button>
        </div>

      </div>
    </div>
  );
};
