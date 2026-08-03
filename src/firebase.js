import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBorq_HvHwLX7T5RmcstG_07lBnvIF4Zjo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "newyou-1725-2219f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "newyou-1725-2219f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "newyou-1725-2219f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "866822923098",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:866822923098:web:605345a3d75d0627b2c963",
};

// Initialize Firebase App & Auth Instance
let app;
let auth;
let googleProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.warn("Firebase Init Warning:", e);
}

export { app, auth, googleProvider };

// Google OAuth Login
export const loginWithGoogle = async () => {
  if (!auth) {
    return { user: null, error: "Firebase API key in .env is missing or invalid." };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    return { user: null, error: error.message || "Failed to sign in with Google." };
  }
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: "Firebase API key in .env is missing or invalid." };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Firebase Email Login Error:", error);
    return { user: null, error: error.message || "Invalid email or password." };
  }
};

// Email/Password Registration
export const registerWithEmail = async (email, password) => {
  if (!auth) {
    return { user: null, error: "Firebase API key in .env is missing or invalid." };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    console.error("Firebase Email Register Error:", error);
    return { user: null, error: error.message || "Failed to register new user." };
  }
};

// Sign Out Helper
export const logoutUser = async () => {
  if (!auth) return { error: null };
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Firebase Signout Error:", error);
    return { error: error.message || "Failed to log out." };
  }
};

export { onAuthStateChanged };
