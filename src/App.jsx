import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginScreen } from './components/AuthModal';
import { StreakBanner } from './components/UserView/StreakBanner';
import { TaskFeed } from './components/UserView/TaskFeed';
import { ProofUploadModal } from './components/UserView/ProofUploadModal';
import { StreakMessageModal } from './components/UserView/StreakMessageModal';
import { InsightsRings } from './components/UserView/InsightsRings';
import { BadgesGrid } from './components/UserView/BadgesGrid';
import { TaskManager } from './components/AdminView/TaskManager';
import { ProofReviewGrid } from './components/AdminView/ProofReviewGrid';
import { UserOverview } from './components/AdminView/UserOverview';
import { MotivationalManager } from './components/AdminView/MotivationalManager';
import { Zap, CheckCircle2 } from 'lucide-react';

const MainContent = () => {
  const { currentUser, authLoading, role, activeTab, toastMessage } = useApp();

  // Loading spinner while Firebase initializes
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/40 flex items-center justify-center text-cyan-glow animate-pulse">
          <Zap className="w-6 h-6" />
        </div>
        <div className="text-xs font-extrabold text-gray-400 tracking-wider uppercase">
          Initializing NewYou Engine...
        </div>
      </div>
    );
  }

  // Unauthenticated -> Render Full-Page Login Screen Directly
  if (!currentUser) {
    return <LoginScreen />;
  }

  // Authenticated -> Render Main Dashboard & Controls
  return (
    <div className="min-h-screen bg-mesh-gradient flex flex-col font-sans text-gray-100 antialiased selection:bg-cyan-glow selection:text-dark-bg">
      <Navbar />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          
          {/* USER VIEW */}
          {role === 'user' && (
            <div className="space-y-8 animate-fadeIn">
              {activeTab === 'dashboard' && (
                <>
                  <StreakBanner />
                  <TaskFeed />
                  <InsightsRings />
                </>
              )}

              {activeTab === 'proofs' && (
                <>
                  <TaskFeed />
                </>
              )}

              {activeTab === 'badges' && (
                <>
                  <StreakBanner />
                  <BadgesGrid />
                </>
              )}

              {activeTab === 'analytics' && (
                <>
                  <InsightsRings />
                </>
              )}
            </div>
          )}

          {/* ADMIN VIEW */}
          {role === 'admin' && (
            <div className="space-y-8 animate-fadeIn">
              {activeTab === 'dashboard' && (
                <>
                  <UserOverview />
                  <ProofReviewGrid />
                </>
              )}

              {activeTab === 'tasks' && (
                <>
                  <TaskManager />
                </>
              )}

              {activeTab === 'motivational' && (
                <>
                  <MotivationalManager />
                </>
              )}

              {activeTab === 'proofs' && (
                <>
                  <ProofReviewGrid />
                </>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Global Modals */}
      <ProofUploadModal />
      <StreakMessageModal />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center space-x-3 px-5 py-3.5 rounded-2xl glass-panel border border-cyan-glow/50 text-white shadow-cyan-glow bg-dark-card/90">
            <CheckCircle2 className="w-5 h-5 text-cyan-glow" />
            <span className="text-xs font-extrabold">{toastMessage.message}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
