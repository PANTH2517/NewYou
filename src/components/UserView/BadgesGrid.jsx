import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Lock, Sparkles, Trophy, CheckCircle2, Shield, Flame, Star, Search, X, Zap, ChevronRight } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

export const BadgesGrid = () => {
  const { badges, getBadgeProgress, triggerConfetti } = useApp();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState(null);

  const unlockedCount = badges.filter(b => b.unlocked).length;
  const totalCount = badges.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const categories = [
    'All',
    'Unlocked',
    'Locked',
    'Specialized Tasks',
    'Achievement',
    'Progression',
    'Streak',
    'Steps',
    'Fitness',
    'Nutrition',
    'Mindfulness',
    'Verification',
  ];

  const filteredBadges = badges.filter(badge => {
    // Search query filter
    const matchesSearch =
      badge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      badge.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'Unlocked') return badge.unlocked;
    if (filter === 'Locked') return !badge.unlocked;
    if (filter === 'Specialized Tasks') return badge.category === 'Specialized Tasks' || badge.rarity === 'Specialized';
    if (filter !== 'All') return badge.category === filter;
    return true;
  });

  const getRarityBadge = (rarity) => {
    switch (rarity) {
      case 'Common':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30 text-[10px] font-bold">🐣 Common</span>;
      case 'Rare':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/40 text-[10px] font-bold">✨ Rare</span>;
      case 'Epic':
        return <span className="px-2.5 py-0.5 rounded-full bg-orange-fire/20 text-orange-fire border border-orange-fire/40 text-[10px] font-extrabold">💎 Epic</span>;
      case 'Legendary':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[10px] font-extrabold animate-pulse">👑 Legendary</span>;
      case 'Mythic':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[10px] font-extrabold animate-pulse">🦄 Mythic</span>;
      case 'Specialized':
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-neon/20 text-emerald-neon border border-emerald-neon/40 text-[10px] font-extrabold">🌟 Specialized Set</span>;
    }
  };

  const handleCardClick = (badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header & Progress Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Cute Badge Showcase & Achievements</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30 shadow-cyan-glow">
              {unlockedCount} / {totalCount} Badges Unlocked
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Every badge starts locked! Upgrade your level, complete habit targets, build streaks, and create specialized tasks in live time to slowly unlock cute achievements.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badges by title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-card border border-dark-border text-white text-xs focus:outline-none focus:border-cyan-glow transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Unlock Progress Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-dark-border bg-gradient-to-r from-dark-card via-dark-surface to-dark-bg relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider">Overall Badge Mastery Progress</div>
              <div className="text-[11px] text-gray-400">Slowly unlock badges as your member tier upgrades</div>
            </div>
          </div>
          <span className="text-sm font-extrabold text-cyan-glow bg-cyan-glow/10 px-3 py-1 rounded-xl border border-cyan-glow/30">
            {progressPercent}% Unlocked
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-dark-bg overflow-hidden border border-dark-border p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-glow via-purple-neon to-amber-400 rounded-full transition-all duration-1000 shadow-cyan-glow"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Category Filters Pill Scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 pt-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border ${
              filter === cat
                ? 'bg-gradient-to-r from-cyan-glow to-blue-500 text-dark-bg border-cyan-glow shadow-cyan-glow scale-105'
                : 'bg-dark-card border-dark-border text-gray-400 hover:text-white hover:border-gray-500'
            }`}
          >
            {cat === 'Specialized Tasks' ? '🌟 Specialized Sets' : cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {filteredBadges.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-dark-border bg-dark-card/30">
          <Award className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
          <h4 className="text-base font-bold text-white mb-1">No Badges Match Your Filter</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Try switching filter category or clear search query to view all core and live specialized badges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBadges.map(badge => {
            const { current, target, percent } = getBadgeProgress(badge);

            return (
              <TiltCard key={badge.id} maxTilt={5}>
                <div
                  onClick={() => handleCardClick(badge)}
                  className={`group relative glass-panel rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between ${
                    badge.unlocked
                      ? 'border-cyan-glow/50 bg-gradient-to-b from-dark-card to-cyan-glow/10 hover:shadow-cyan-glow cursor-pointer'
                      : 'border-dark-border/80 bg-dark-card/40 hover:border-gray-600 cursor-pointer'
                  }`}
                >
                  
                  <div>
                    {/* Top Row: Cute Icon & Rarity Tag */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border transition-all duration-300 ${
                            badge.unlocked
                              ? 'bg-dark-bg border-cyan-glow shadow-cyan-glow group-hover:scale-110 group-hover:rotate-3'
                              : 'bg-dark-bg/80 border-dark-border grayscale opacity-60 group-hover:scale-105'
                          }`}
                        >
                          {badge.icon || '🏆'}
                        </div>

                        {!badge.unlocked && (
                          <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-dark-bg border border-dark-border text-amber-400 shadow-md">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        {getRarityBadge(badge.rarity)}
                      </div>
                    </div>

                    {/* Badge Title & Description */}
                    <h4 className="font-extrabold text-white text-base mb-1 flex items-center space-x-1.5">
                      <span>{badge.title}</span>
                      {badge.unlocked && <CheckCircle2 className="w-4 h-4 text-emerald-neon flex-shrink-0" />}
                    </h4>

                    <p className="text-xs text-gray-400 font-medium leading-relaxed mb-4 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>

                  {/* Live Progress Bar for Locked Badges */}
                  <div>
                    {!badge.unlocked && (
                      <div className="mb-3 p-3 rounded-2xl bg-dark-bg/60 border border-dark-border/60">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                          <span className="text-gray-400">Unlock Progress</span>
                          <span className="text-cyan-glow font-extrabold">{current} / {target} ({percent}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-dark-card border border-dark-border/40 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-glow to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer Status Row */}
                    <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between text-[11px]">
                      {badge.unlocked ? (
                        <span className="font-bold text-emerald-neon flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 animate-spin" />
                          <span>UNLOCKED 🎉</span>
                        </span>
                      ) : (
                        <span className="font-bold text-amber-400 flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>LOCKED ({percent}% Done)</span>
                        </span>
                      )}

                      <span className="text-gray-500 font-medium px-2 py-0.5 rounded-lg bg-dark-bg/50 border border-dark-border/30">
                        {badge.category}
                      </span>
                    </div>
                  </div>

                </div>
              </TiltCard>
            );
          })}
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-md glass-panel rounded-3xl border border-dark-border p-6 shadow-2xl text-center">
            
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Icon Display */}
            <div className="w-24 h-24 rounded-3xl bg-dark-bg border-2 border-cyan-glow shadow-cyan-glow mx-auto mb-4 flex items-center justify-center text-5xl">
              {selectedBadge.icon || '🏆'}
            </div>

            <div className="mb-2">
              {getRarityBadge(selectedBadge.rarity)}
            </div>

            <h3 className="text-xl font-display font-extrabold text-white mb-2 flex items-center justify-center space-x-2">
              <span>{selectedBadge.title}</span>
              {selectedBadge.unlocked && <CheckCircle2 className="w-5 h-5 text-emerald-neon" />}
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              {selectedBadge.description}
            </p>

            {/* Unlock Status / Progress Box */}
            <div className="p-4 rounded-2xl bg-dark-bg border border-dark-border text-left space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold">Category</span>
                <span className="text-white font-extrabold">{selectedBadge.category}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold">Status</span>
                {selectedBadge.unlocked ? (
                  <span className="text-emerald-neon font-extrabold flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked & Complete</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-extrabold flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              {!selectedBadge.unlocked && (() => {
                const { current, target, percent } = getBadgeProgress(selectedBadge);
                return (
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Requirements Progress</span>
                      <span className="text-cyan-glow">{current} / {target} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-dark-card overflow-hidden border border-dark-border">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-glow to-blue-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })()}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-blue-500 text-dark-bg font-extrabold text-xs shadow-cyan-glow"
            >
              {selectedBadge.unlocked ? 'Awesome! 🚀' : 'Keep Upgrading! 💪'}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

