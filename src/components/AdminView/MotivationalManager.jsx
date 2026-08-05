import React from 'react';
import { useApp } from '../../context/AppContext';
import { MOTIVATIONAL_CATEGORIES } from '../../constants';
import { Sliders, Users, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

export const MotivationalManager = () => {
  const { 
    motivationalCategory, 
    setMotivationalCategory, 
    userTonePreferences, 
    setUserTonePreference,
    currentUser,
    user,
    registeredUsers,
    deleteUser,
    proofs,
    showToast
  } = useApp();

  // Extract unique active members from Firestore registered users, proofs & current session
  const emailMap = {};
  registeredUsers.forEach(u => {
    if (u.email) emailMap[u.name?.toLowerCase()] = u.email.toLowerCase();
    if (u.email) emailMap[u.handle?.toLowerCase()] = u.email.toLowerCase();
  });
  if (user?.email && user?.name) emailMap[user.name.toLowerCase()] = user.email.toLowerCase();
  if (currentUser?.email) emailMap[currentUser.email.split('@')[0].toLowerCase()] = currentUser.email.toLowerCase();
  proofs.forEach(p => {
    if (p.userEmail && p.userName) emailMap[p.userName.toLowerCase()] = p.userEmail.toLowerCase();
  });

  const rawKeys = [
    ...registeredUsers.map(u => u.email || u.handle || u.name).filter(Boolean),
    ...(currentUser?.email ? [currentUser.email] : []),
    ...(user?.email ? [user.email] : []),
    ...proofs.map(p => p.userEmail || p.userName).filter(Boolean),
    ...Object.keys(userTonePreferences)
  ];

  const dynamicMemberKeys = Array.from(new Set(
    rawKeys.map(k => emailMap[k.toLowerCase()] || k.toLowerCase())
  )).filter(key => {
    const keyLower = String(key).toLowerCase().trim();
    return (
      Boolean(keyLower) &&
      keyLower !== 'demo' &&
      keyLower !== '@member' &&
      keyLower !== 'example@google.com' &&
      keyLower !== 'example@gmail.com'
    );
  });

  const handleClearRoster = () => {
    localStorage.removeItem('newself_user_tones');
    registeredUsers.forEach(u => deleteUser(u.id || u.email));
    showToast('Member tone roster cleared!', 'info');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Per-User Motivational Tone Assignment Engine</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-fire/15 text-orange-fire border border-orange-fire/30">
              Admin Controller
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Assign custom motivational tones (Hard On-Point, Romantic & Affirming, Hype, Zen) individually to each member.
          </p>
        </div>

        {dynamicMemberKeys.length > 0 && (
          <button
            onClick={handleClearRoster}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/25 text-xs font-extrabold transition-all self-start sm:self-auto"
          >
            Clear Tone Roster
          </button>
        )}
      </div>

      {/* 1. PER-USER INDIVIDUAL TONE ASSIGNMENT TABLE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-glow" />
            <span>Individual Member Tone Roster</span>
          </h4>
          <span className="text-xs text-gray-400 font-medium">Admins control tone per person</span>
        </div>

        {dynamicMemberKeys.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center border border-dark-border space-y-2">
            <Users className="w-8 h-8 text-gray-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Active Member Roster Entries Yet</h4>
            <p className="text-xs text-gray-400">
              Member accounts will populate automatically here as users log in and submit task proofs.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-3xl border border-dark-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-dark-bg/80 border-b border-dark-border text-gray-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Member Identifier</th>
                    <th className="py-4 px-5">Assigned Motivational Tone</th>
                    <th className="py-4 px-5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/60">
                  {dynamicMemberKeys.map((memberKey) => {
                    const activeToneId = userTonePreferences[memberKey] || motivationalCategory || 'hard';
                    const toneConfig = MOTIVATIONAL_CATEGORIES[activeToneId] || MOTIVATIONAL_CATEGORIES.hard;

                    return (
                      <tr key={memberKey} className="hover:bg-dark-card/60 transition-colors">
                        
                        {/* Member Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center font-extrabold text-cyan-glow uppercase">
                              {memberKey.replace('@', '').charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-white text-sm">{memberKey}</div>
                              <div className="text-[11px] text-gray-400 font-medium">Registered Routine Member</div>
                            </div>
                          </div>
                        </td>

                        {/* Active Assigned Tone Badge */}
                        <td className="py-4 px-5">
                          <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-extrabold ${toneConfig.badgeClass}`}>
                            <span>{toneConfig.icon}</span>
                            <span>{toneConfig.title}</span>
                          </div>
                        </td>

                        {/* Individual Tone Selector Dropdown & Delete Action */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <select
                              value={activeToneId}
                              onChange={(e) => setUserTonePreference(memberKey, e.target.value)}
                              className="px-3 py-1.5 rounded-xl bg-dark-bg border border-dark-border text-white text-xs font-bold focus:outline-none focus:border-cyan-glow cursor-pointer"
                            >
                              <option value="hard">🔥 Hard On-Point (Discipline)</option>
                              <option value="romantic">💖 Romantic & Affirming</option>
                              <option value="hype">⚡ High Energy & Hype</option>
                              <option value="zen">🧘 Zen & Mindful Wisdom</option>
                            </select>

                            <button
                              onClick={() => deleteUser(memberKey)}
                              className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30 transition-colors"
                              title="Delete Member from Roster"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}
      </div>

      {/* 2. GLOBAL CATEGORY TONES CATALOGUE */}
      <div className="pt-4 border-t border-dark-border/60">
        <h4 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-orange-fire" />
          <span>Motivational Category Catalogue & Preview Templates</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(MOTIVATIONAL_CATEGORIES).map((cat) => {
            const isSelected = motivationalCategory === cat.id;

            return (
              <TiltCard key={cat.id} maxTilt={6}>
                <div
                  onClick={() => setMotivationalCategory(cat.id)}
                  className={`glass-panel rounded-3xl p-6 border transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-orange-fire bg-orange-fire/10 shadow-orange-glow'
                      : 'border-dark-border hover:border-cyan-glow/50 bg-dark-card/60 hover:bg-dark-card'
                  }`}
                >
                  {/* Active Selection Pill */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-orange-fire text-white text-[10px] font-extrabold flex items-center space-x-1 shadow-orange-glow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>GLOBAL DEFAULT</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-dark-bg border border-dark-border flex items-center justify-center text-2xl">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base">{cat.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">{cat.description}</p>
                    </div>
                  </div>

                  {/* Sample Template Messages Preview */}
                  <div className="space-y-2 mt-4 pt-4 border-t border-dark-border/60">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Sample Message Templates:
                    </div>
                    {cat.messages.slice(0, 2).map((msg, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-dark-bg/80 border border-dark-border text-xs text-gray-300 italic"
                      >
                        "{msg.replace(/{name}/g, 'Member').replace(/{streak}/g, '14')}"
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

    </div>
  );
};
