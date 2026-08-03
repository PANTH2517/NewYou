import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Camera, 
  Award, 
  BarChart3, 
  PlusCircle, 
  Flame,
  Shield,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { role, activeTab, setActiveTab, proofs } = useApp();

  const pendingProofsCount = proofs.filter(p => p.status === 'pending').length;

  const userNavItems = [
    { id: 'dashboard', label: 'Daily Feed', icon: CheckSquare },
    { id: 'proofs', label: 'Proof Submissions', icon: Camera },
    { id: 'badges', label: 'Streak & Badges', icon: Award },
    { id: 'analytics', label: 'Progress Insights', icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'System Overview', icon: BarChart3 },
    { id: 'tasks', label: 'Task CRUD Portal', icon: PlusCircle },
    { id: 'motivational', label: 'Motivational Tones', icon: Sparkles },
    { id: 'proofs', label: 'Proof Review Grid', icon: Camera, badge: pendingProofsCount },
  ];

  const currentNav = role === 'user' ? userNavItems : adminNavItems;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block glass-panel border-r border-dark-border/80 min-h-[calc(100vh-5rem)] p-4">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-6">
          
          {/* Mode Header Indicator */}
          <div className="px-3.5 py-3 rounded-xl bg-dark-card/80 border border-dark-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${role === 'user' ? 'bg-cyan-glow animate-pulse' : 'bg-orange-fire animate-pulse'}`} />
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-200">
                {role === 'user' ? 'Member Tracker' : 'Admin Control'}
              </span>
            </div>
            {role === 'admin' ? (
              <Shield className="w-4 h-4 text-orange-fire" />
            ) : (
              <Flame className="w-4 h-4 text-cyan-glow" />
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
              Navigation
            </div>
            {currentNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? role === 'user'
                        ? 'bg-gradient-to-r from-cyan-glow/20 to-transparent border-l-4 border-cyan-glow text-white shadow-sm'
                        : 'bg-gradient-to-r from-orange-fire/20 to-transparent border-l-4 border-orange-fire text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-card/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? (role === 'user' ? 'text-cyan-glow' : 'text-orange-fire') : 'text-gray-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-extrabold rounded-full bg-orange-fire text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Bottom Card System Status */}
        <div className="pt-4 border-t border-dark-border/60">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-dark-card to-dark-bg border border-dark-border relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-16 h-16 bg-cyan-glow/10 rounded-full blur-xl" />
            <div className="flex items-center space-x-2 text-cyan-glow text-xs font-bold mb-1">
              <Flame className="w-4 h-4 text-orange-fire" />
              <span>System Status</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Real-time Firestore & Motivational Tone Engine active.
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
};
