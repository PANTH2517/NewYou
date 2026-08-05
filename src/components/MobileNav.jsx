import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, 
  Camera, 
  Award, 
  BarChart3, 
  PlusCircle, 
  Sparkles
} from 'lucide-react';

export const MobileNav = () => {
  const { role, activeTab, setActiveTab, proofs } = useApp();

  const pendingProofsCount = proofs.filter(p => p.status === 'pending').length;

  const userNavItems = [
    { id: 'dashboard', label: 'Feed', icon: CheckSquare },
    { id: 'proofs', label: 'Proofs', icon: Camera },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'analytics', label: 'Insights', icon: BarChart3 },
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'tasks', label: 'Tasks', icon: PlusCircle },
    { id: 'motivational', label: 'Tones', icon: Sparkles },
    { id: 'proofs', label: 'Review', icon: Camera, badge: pendingProofsCount },
  ];

  const currentNav = role === 'user' ? userNavItems : adminNavItems;

  return (
    <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-2xl border-t border-dark-border py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? role === 'user'
                    ? 'text-cyan-glow bg-cyan-glow/10 font-bold'
                    : 'text-orange-fire bg-orange-fire/10 font-bold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-extrabold">{item.label}</span>

              {item.badge > 0 && (
                <span className="absolute -top-1 right-2 w-4 h-4 text-[9px] font-extrabold rounded-full bg-orange-fire text-white flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
