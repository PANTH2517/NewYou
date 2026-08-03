import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertTriangle, 
  Zap, 
  Flame, 
  CheckCircle2, 
  Shield,
  KeyRound
} from 'lucide-react';

export const LoginScreen = () => {
  const { 
    ADMIN_EMAIL,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    registerUserInMongoDB,
    setUser,
    setAdmin,
    setRole,
    showToast
  } = useApp();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isApiKeyError, setIsApiKeyError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsApiKeyError(false);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    let result;

    if (authMode === 'login') {
      result = await loginWithEmail(email, password);
    } else {
      result = await registerWithEmail(email, password);
    }

    setIsLoading(false);

    if (result.error) {
      const errStr = result.error.toLowerCase();
      if (errStr.includes('api key not valid') || errStr.includes('api-key-not-valid') || errStr.includes('invalid-api-key')) {
        setIsApiKeyError(true);
        setErrorMessage('Firebase API key in .env is missing or invalid.');
      } else {
        const cleanMsg = result.error.replace('Firebase: ', '').replace(/auth\//g, '').replace(/-/g, ' ');
        setErrorMessage(cleanMsg);
      }
    } else if (result.user) {
      registerUserInMongoDB({
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email.split('@')[0],
        role: result.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsApiKeyError(false);
    setIsLoading(true);
    const result = await loginWithGoogle();
    setIsLoading(false);

    if (result.error) {
      const errStr = result.error.toLowerCase();
      if (errStr.includes('api key not valid') || errStr.includes('api-key-not-valid') || errStr.includes('invalid-api-key')) {
        setIsApiKeyError(true);
        setErrorMessage('Firebase API key in .env is missing or invalid.');
      } else {
        const cleanMsg = result.error.replace('Firebase: ', '').replace(/auth\//g, '').replace(/-/g, ' ');
        setErrorMessage(cleanMsg);
      }
    } else if (result.user) {
      registerUserInMongoDB({
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName || result.user.email.split('@')[0],
        role: result.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
      });
    }
  };

  // Fallback for instant preview testing if Firebase credentials haven't been added to .env yet
  const handleBypassTestLogin = () => {
    const inputEmail = email.trim() || "alex.vance@newself.app";
    const isAdmin = inputEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const userPayload = {
      id: `user-${Date.now()}`,
      email: inputEmail,
      name: inputEmail.split('@')[0],
      handle: `@${inputEmail.split('@')[0]}`,
      role: isAdmin ? 'admin' : 'user'
    };

    registerUserInMongoDB(userPayload);

    if (isAdmin) {
      setRole('admin');
      setAdmin(prev => ({ ...prev, name: userPayload.name, handle: userPayload.handle }));
      showToast(`Signed in as Admin (${inputEmail})`, 'success');
    } else {
      setRole('user');
      setUser(prev => ({ ...prev, name: userPayload.name, handle: userPayload.handle }));
      showToast(`Signed in as ${inputEmail}`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-mesh-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-glow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-fire/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-dark-border/90 p-8 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-glow to-orange-fire p-0.5 shadow-cyan-glow">
              <div className="w-full h-full bg-dark-bg rounded-[14px] flex items-center justify-center">
                <Zap className="w-6 h-6 text-cyan-glow fill-cyan-glow/20" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white block leading-none">
                New<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-orange-fire">You</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Routine Engine
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-display font-extrabold text-white">
            {authMode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {authMode === 'login'
              ? 'Sign in to access your daily tasks, fire streaks, and proof verifications.'
              : 'Register to start tracking habits, building momentum, and earning XP.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold space-y-2 animate-shake">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="font-bold text-white uppercase tracking-wider">Authentication Alert</span>
            </div>
            <p className="text-xs text-rose-200 leading-relaxed">{errorMessage}</p>

            {isApiKeyError && (
              <div className="pt-2 border-t border-rose-500/30 text-[11px] text-gray-300 space-y-2">
                <p>
                  To connect live Firebase, paste your web app credentials in the <code className="text-cyan-glow font-bold">.env</code> file:
                </p>
                <div className="bg-dark-bg/80 p-2 rounded-lg text-[10px] font-mono text-cyan-glow overflow-x-auto">
                  VITE_FIREBASE_API_KEY=AIzaSy...
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleBypassTestLogin}
                    className="w-full py-2 px-3 rounded-lg bg-orange-fire/20 border border-orange-fire/50 text-orange-fire hover:bg-orange-fire/30 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Continue with Local Test Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Auth Mode Switcher Tabs */}
        <div className="flex rounded-xl bg-dark-bg p-1 border border-dark-border mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); setIsApiKeyError(false); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
              authMode === 'login'
                ? 'bg-cyan-glow text-dark-bg shadow-cyan-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setIsApiKeyError(false); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all ${
              authMode === 'register'
                ? 'bg-cyan-glow text-dark-bg shadow-cyan-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-dark-card border border-dark-border hover:border-cyan-glow/60 text-white font-bold text-xs flex items-center justify-center space-x-3 transition-all mb-4"
        >
          {/* Official Google SVG Logo */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.6 14.8 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.8 3C6.1 6.8 8.8 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.1 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.3 6.2C.5 8 0 10 0 12s.5 4 1.3 5.8l3.8-3z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.9-1.8-6.9-4.6l-3.8 3C3.3 21.3 7.3 24 12 24z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-dark-border w-full" />
          <span className="bg-dark-card px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest absolute">
            or email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-cyan-glow" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-cyan-glow"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-cyan-glow" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white text-xs focus:outline-none focus:border-cyan-glow"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-glow to-cyan-accent text-dark-bg font-extrabold text-xs shadow-cyan-glow hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <span>{authMode === 'login' ? 'Sign In to Account' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

export const AuthModal = LoginScreen;
