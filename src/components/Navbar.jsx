import React from 'react';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './Common/UserAvatar';
import { Flame, Shield, Sparkles, Zap, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { 
    role, 
    user, 
    admin, 
    currentUser, 
    currentUserRole,
    logoutUser,
    dailyProgressPercent,
    levelInfo 
  } = useApp();

  const activeProfile = role === 'user' ? user : admin;
  const displayName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : activeProfile.name);
  const displayEmail = currentUser?.email || activeProfile.handle;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/90 bg-dark-bg/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* 1. Brand Logo & Role Badge */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-glow to-orange-fire p-0.5 shadow-cyan-glow flex items-center justify-center">
            <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-glow fill-cyan-glow/20" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-display font-black text-xl tracking-tight text-white">
              New<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-orange-fire">You</span>
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border whitespace-nowrap ${
              currentUserRole === 'admin' 
                ? 'bg-orange-fire/15 text-orange-fire border-orange-fire/40' 
                : 'bg-cyan-glow/10 text-cyan-glow border-cyan-glow/30'
            }`}>
              {currentUserRole === 'admin' ? 'Admin Portal' : 'Tracker'}
            </span>
          </div>
        </div>

        {/* 2. Sleek Telemetry Badges (Middle Header Bar) */}
        <div className="hidden lg:flex items-center space-x-3">
          {role === 'user' ? (
            <>
              {/* Active Streak Badge */}
              <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-orange-fire/10 border border-orange-fire/30">
                <Flame className="w-4 h-4 text-orange-fire animate-pulse" />
                <span className="text-xs font-black text-white whitespace-nowrap">
                  {user.streak} Day Streak 🔥
                </span>
              </div>

              {/* Progress Ring & Daily Score */}
              <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-dark-card border border-dark-border">
                <div className="w-20 h-2 bg-dark-bg rounded-full overflow-hidden border border-dark-border">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-glow to-emerald-neon transition-all duration-500"
                    style={{ width: `${dailyProgressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-black text-cyan-glow whitespace-nowrap">
                  {dailyProgressPercent}% Done
                </span>
              </div>

              {/* Level & XP Badge */}
              <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-purple-900/20 border border-purple-500/30">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-purple-300 whitespace-nowrap">
                  Lvl {levelInfo.level} • {user.xp} XP
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2.5 px-4 py-1.5 rounded-xl bg-orange-fire/10 border border-orange-fire/40">
              <Shield className="w-4 h-4 text-orange-fire" />
              <span className="text-xs font-black text-orange-fire uppercase tracking-wider">
                System Command Center
              </span>
            </div>
          )}
        </div>

        {/* 3. User Avatar & Logout */}
        <div className="flex items-center space-x-3 shrink-0">
          
          <div className="flex items-center space-x-2.5 bg-dark-card/60 p-1.5 pr-3 rounded-2xl border border-dark-border">
            <UserAvatar
              src={currentUser?.photoURL || activeProfile.avatar}
              name={displayName}
              className="w-8 h-8 rounded-xl"
              borderClass={`border ${role === 'admin' ? 'border-orange-fire' : 'border-cyan-glow/50'}`}
              textClass={`text-xs font-black ${role === 'admin' ? 'text-orange-fire' : 'text-cyan-glow'}`}
            />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-white leading-none uppercase tracking-wider truncate max-w-[120px]">
                {displayName}
              </div>
              <div className="text-[10px] text-gray-400 font-medium truncate max-w-[120px] mt-0.5">
                {displayEmail}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logoutUser}
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 transition-all text-xs font-black flex items-center space-x-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>

        </div>

      </div>
    </header>
  );
};
