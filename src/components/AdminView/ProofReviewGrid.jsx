import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../Common/UserAvatar';
import { Check, X, RefreshCcw, Eye, Clock, ShieldCheck, AlertCircle, Camera, User, Filter, Trash2 } from 'lucide-react';
import { TiltCard } from '../Common/TiltCard';

const PRESET_FALLBACK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="360" viewBox="0 0 600 360">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
  </defs>
  <rect width="600" height="360" rx="20" fill="url(#g)"/>
  <circle cx="300" cy="140" r="50" fill="rgba(255,255,255,0.2)"/>
  <text x="300" y="148" font-family="system-ui, sans-serif" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle">✓</text>
  <text x="300" y="230" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#ffffff" text-anchor="middle">Verified Task Proof</text>
  <text x="300" y="260" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="rgba(255,255,255,0.85)" text-anchor="middle">Media Verification Stream</text>
</svg>
`)}`;

export const ProofReviewGrid = () => {
  const { proofs, approveProof, rejectProof, deleteProof } = useApp();
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [previewImage, setPreviewImage] = useState(null);

  const filteredProofs = filterStatus === 'all'
    ? proofs
    : proofs.filter(p => p.status === filterStatus);

  const pendingCount = proofs.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-display font-extrabold text-white flex items-center space-x-2">
            <span>Proof Verification Review Stream</span>
            {pendingCount > 0 && (
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-orange-fire text-white animate-pulse shadow-orange-glow">
                {pendingCount} Pending Review
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Review photo submissions from users to validate task completion and protect streak integrity.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2">
          {['pending', 'approved', 'rejected', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-orange-fire text-white shadow-orange-glow'
                  : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
              }`}
            >
              {st} {st === 'pending' && `(${pendingCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Proof Cards */}
      {filteredProofs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-dark-border">
          <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white">No Proof Submissions Found</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
            There are currently no task proof submissions under the "{filterStatus}" filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProofs.map((proof) => (
            <TiltCard key={proof.id} maxTilt={6}>
              <div className="glass-panel rounded-2xl p-5 border border-dark-border flex flex-col justify-between h-full hover:border-orange-fire/40 transition-all">
                
                <div>
                  {/* User Info Header with Glitch-Free Avatar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        src={proof.userAvatar}
                        name={proof.userName}
                        className="w-10 h-10 rounded-xl"
                        borderClass="border border-cyan-glow/40"
                      />
                      <div>
                        <div className="font-extrabold text-sm text-white">{proof.userName}</div>
                        <div className="text-[11px] text-gray-400 font-medium flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-cyan-glow" />
                          <span>{proof.submittedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Delete Button */}
                    <div className="flex items-center space-x-2">
                      {proof.status === 'approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-neon/15 text-emerald-neon border border-emerald-neon/30 text-[10px] font-bold">
                          Approved
                        </span>
                      )}
                      {proof.status === 'pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                          Pending
                        </span>
                      )}
                      {proof.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                          Rejected
                        </span>
                      )}
                      <button
                        onClick={() => deleteProof(proof.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 transition-all"
                        title="Delete proof submission permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Task Title */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-glow bg-cyan-glow/10 px-2 py-0.5 rounded-md">
                      {proof.category}
                    </span>
                    <h4 className="font-extrabold text-white text-sm mt-1.5">{proof.taskTitle}</h4>
                  </div>

                  {/* Image Preview Container */}
                  <div className="relative group rounded-xl overflow-hidden mb-3 border border-dark-border bg-black/60 aspect-video flex items-center justify-center">
                    <img
                      src={proof.imageUrl || PRESET_FALLBACK_SVG}
                      alt={proof.taskTitle}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PRESET_FALLBACK_SVG;
                      }}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      onClick={() => setPreviewImage(proof.imageUrl)}
                      className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <span className="px-3 py-1.5 rounded-xl bg-cyan-glow text-dark-bg font-extrabold text-xs flex items-center space-x-1.5 shadow-cyan-glow">
                        <Eye className="w-4 h-4" />
                        <span>Inspect Full Image</span>
                      </span>
                    </div>
                  </div>

                  {/* User Caption */}
                  {proof.caption && (
                    <p className="text-xs text-gray-300 italic mb-4 bg-dark-bg/60 p-2.5 rounded-xl border border-dark-border">
                      "{proof.caption}"
                    </p>
                  )}
                </div>

                {/* Admin Quick Action Buttons */}
                <div className="pt-3 border-t border-dark-border/60 flex items-center justify-between gap-2">
                  {proof.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => rejectProof(proof.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500/20 transition-colors flex items-center justify-center space-x-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => rejectProof(proof.id, 'Blurry image - please re-upload clear proof.')}
                        className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
                        title="Request Re-upload"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => approveProof(proof.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-neon text-dark-bg font-extrabold text-xs shadow-emerald-glow hover:scale-105 transition-all flex items-center justify-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full text-center py-1.5 text-xs font-semibold text-gray-400">
                      Reviewed & Finalized
                    </div>
                  )}
                </div>

              </div>
            </TiltCard>
          ))}
        </div>
      )}

      {/* Full Image Preview Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/90 backdrop-blur-2xl animate-fadeIn">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-dark-border glass-panel p-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-dark-bg border border-dark-border text-white hover:text-cyan-glow"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={previewImage} alt="Full Proof" referrerPolicy="no-referrer" className="max-h-[80vh] w-auto rounded-2xl object-contain mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
};
