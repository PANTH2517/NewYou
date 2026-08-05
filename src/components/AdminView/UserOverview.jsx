import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Activity, CheckCircle2, Clock } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

export const UserOverview = () => {
  const { adminStats, tasks } = useApp();

  const totalTasks = tasks.length;
  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Admin System Telemetry</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-fire/15 text-orange-fire border border-orange-fire/30">
              Live Monitoring
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time analytics for system habits, pending reviews, verified proofs, and database state.
          </p>
        </div>
      </div>

      {/* Telemetry Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-2xl p-5 border border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active System Habits</span>
              <div className="p-2 rounded-xl bg-cyan-glow/10 text-cyan-glow">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{totalTasks} Habits</div>
            <p className="text-[11px] text-cyan-glow font-medium mt-1">Total {totalPoints} XP available daily</p>
          </div>
        </TiltCard>

        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-2xl p-5 border border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Review</span>
              <div className="p-2 rounded-xl bg-orange-fire/10 text-orange-fire">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{adminStats.pendingVerifications}</div>
            <p className="text-[11px] text-orange-fire font-medium mt-1">Requires admin validation</p>
          </div>
        </TiltCard>

        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-2xl p-5 border border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Today</span>
              <div className="p-2 rounded-xl bg-emerald-neon/10 text-emerald-neon">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{adminStats.approvedToday}</div>
            <p className="text-[11px] text-emerald-neon font-medium mt-1">Verified photo proofs</p>
          </div>
        </TiltCard>

        <TiltCard maxTilt={8}>
          <div className="glass-panel rounded-2xl p-5 border border-dark-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Health</span>
              <div className="p-2 rounded-xl bg-purple-neon/10 text-purple-neon">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white">{adminStats.systemUptime}</div>
            <p className="text-[11px] text-purple-neon font-medium mt-1">Real-time Firebase Sync</p>
          </div>
        </TiltCard>

      </div>

    </div>
  );
};
