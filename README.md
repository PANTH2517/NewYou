# 🔥 NewYou — Modern Routine Tracker & Admin Management System

![NewYou Platform](public/favicon.svg)

**NewYou** is a modern, gamified routine tracking platform designed to build ironclad habits. It features interactive photo proof verification, dynamic XP leveling, automated streak momentum engines, an Admin Management Portal, and real-time cloud data synchronization.

---

## ✨ Key Features

### 🏋️‍♂️ Member Dashboard
- **Dynamic Habit Engine**: Interactive daily tasks with real-time numeric progress tracking, target units, and XP rewards.
- **Visual Proof Submissions**: Upload photo proof for assigned routines (e.g., gym check-ins, hydration, reading pages) for admin verification.
- **Leveling & XP Progression**: Gain XP per completed habit to unlock higher levels and ranks from *Novice Initiated* to *Routine Master*.
- **Streak Momentum Engine**: Automated daily streak counter with interactive motivational popups and milestone celebrations powered by `canvas-confetti`.
- **Dynamic Specialized Badges**: Track unlocked badges across multiple categories, including 4-tier specialized milestone badges generated dynamically for custom habits.

### 🛡️ Admin Commander Portal
- **Proof Review & Verification Grid**: Inspect submitted task photo evidence, approve completions, or reject non-compliant proofs with custom feedback notes.
- **Habit & Specialized Badge Creator**: Create target habits assigned to all members or specific individuals. Automatically generates 4 specialized badge tiers (*Initiate*, *Specialist*, *Hardcore Titan*, *100x Sovereign*) upon creation.
- **Motivational Tone Manager**: Customize global motivational tones or assign personalized encouragement categories (*Hardcore*, *Stoic*, *Gentle*, *Hype*) to individual users.
- **User Analytics Overview**: Monitor active user streaks, overall compliance scores, pending verifications, and system operational stats.

### ☁️ Cloud Persistence & Offline Resiliency
- **Firebase Auth & Firestore**: Real-time authentication and cloud document synchronization.
- **LocalStorage Fallback**: Operates offline or in local demo mode without breaking state persistence.

---

## 🛠️ Tech Stack

- **Core**: React 19, JavaScript (ES Module)
- **Build Tooling**: Vite 8, PostCSS, Oxlint
- **Styling**: Tailwind CSS v4, Vanilla CSS design system, Lucide React Icons
- **Effects & UI**: `canvas-confetti`, custom 3D card tilt utilities
- **Backend & Authentication**: Firebase v12 (Auth & Firestore DB)
- **Deployment**: Vercel SPA configuration ready ([vercel.json](file:///c:/Users/phhav/OneDrive/Desktop/NewYou/vercel.json))

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PANTH2517/NewYou.git
   cd NewYou
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy `.env.example`):
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Designated Admin Email Guard
   VITE_ADMIN_EMAIL=admin@newyou.com
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel

1. **Push your repository to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [Vercel New Project](https://vercel.com/new).
   - Select `PANTH2517/NewYou`.
   - Add the environment variables (`VITE_FIREBASE_*` and `VITE_ADMIN_EMAIL`) under project settings.
   - Click **Deploy**.

> Note: The included [`vercel.json`](file:///c:/Users/phhav/OneDrive/Desktop/NewYou/vercel.json) handles Single Page Application (SPA) routing rewrites to ensure subroutes reload smoothly.

---

## 📂 Project Structure

```text
NewYou/
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Images & SVGs
│   ├── components/
│   │   ├── AdminView/      # TaskManager, ProofReviewGrid, MotivationalManager, UserOverview
│   │   ├── Common/         # TiltCard, UserAvatar
│   │   ├── UserView/       # TaskFeed, BadgesGrid, InsightsRings, StreakBanner, ProofUploadModal
│   │   ├── AuthModal.jsx   # Firebase Google & Email Auth Modal
│   │   ├── Navbar.jsx      # Top navigation header with role toggles & user profile
│   │   └── Sidebar.jsx     # Navigation sidebar
│   ├── context/
│   │   └── AppContext.jsx  # Central state provider, badge unlock engine & streak calculator
│   ├── services/
│   │   └── dbService.js    # Firestore real-time sync & Express/MongoDB REST API contracts
│   ├── constants.js        # XP levels, badge definitions, motivational categories
│   ├── firebase.js         # Firebase init & auth helper functions
│   └── mockData.js         # Initial fallbacks & difficulty mapping
├── .env.example            # Sample environment variables config
├── vercel.json             # Vercel SPA routing rewrite config
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies & scripts
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
