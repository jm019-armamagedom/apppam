# 🎬 Movie Catalog App

A cross‑platform Expo app that lets you browse, search and watch movies using **The Movie Database (TMDB)** as a data source. The app includes:
- A **home carousel** of popular movies.
- **Search** with genre and provider filters.
- **Infinite‑scroll results** powered by React Query.
- A **watchlist** stored locally with persistence via Zustand.
- Detailed movie view including streaming provider links.
- Global **drawer navigation** (Home, Search, Watchlist).
- **TypeScript**, **React Query**, **Zustand**, **React Native Paper**, **React Native Reanimated**.

---

## 📦 Stack
- **Expo SDK 57** (`expo@~57.0.19`)
- **React Native 0.86.3**
- **React 19.2.3**
- **TypeScript 5.4.5**
- **React Navigation** (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/drawer`)
- **React Query 5** (`@tanstack/react-query` + devtools)
- **Zustand 5** – persisted store for the watchlist
- **React Native Paper** for UI components
- **React Native Reanimated 4** for smooth animations
- **Vercel Serverless Proxy** (`/api/tmdb/*`) with KV caching for TMDB calls

---

## 🔧 Setup
1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd movie-catalog
   ```
2. **Install dependencies**
   ```bash
   npm ci   # uses package-lock for reproducible install
   ```
3. **Environment variables**
   - Create a `.env` file in the project root (or set env vars in Vercel). The only required variable is:
     ```env
     TMDB_API_KEY=your_tmdb_api_key_here
     ```
   - The app does **not** access the key directly; the Vercel proxy reads it from the Vercel environment.

4. **Start the development server**
   ```bash
   npm start   # expo start
   ```
   - Choose **Android**, **iOS**, or **Web** in the Expo Go UI.

---

## 📱 Running on Device
- **iOS**: Press `i` in the Expo DevTools to open the iOS simulator.
- **Android**: Press `a` to open an Android emulator or your device via QR code.
- **Web**: Press `w` for a web preview.

---

## 📦 Building & Publishing
### Using EAS (Expo Application Services)
1. **Install EAS CLI** (if you haven’t already):
   ```bash
   npm i -g eas-cli
   ```
2. **Login to Expo**
   ```bash
   eas login
   ```
3. **Build (preview / development client)**
   ```bash
   eas build --profile preview --platform all
   ```
   - This produces an internal‑distribution APK (Android) and a simulator‑compatible iOS build.
4. **Build for production (store ready)**
   ```bash
   eas build --profile production --platform all
   ```
   - The produced artefacts can be submitted to the Google Play Store and Apple App Store.

---

## ⚙️ Serverless TMDB Proxy (Vercel)
The app talks to **/api/tmdb/** endpoints which are backed by a Vercel serverless function (`movie-catalog/api/tmdb/index.ts`). It:
- Forwards requests to TMDB.
- Caches responses in **Vercel KV** for 1 hour (`x‑cache: HIT/MISS`).
- Requires the `TMDB_API_KEY` environment variable in Vercel (`vercel env add TMDB_API_KEY production`).

You can test the proxy locally with `vercel dev` (once Vercel CLI is installed).

---

## 🧪 Testing
- **Jest** is configured with **ts‑jest** (ESM). Run tests with:
  ```bash
  npm test
  ```
- The CI workflow runs the lint step, a full TypeScript compile (`npx tsc --noEmit`) and the Jest suite.

---

## 📐 Linting & Formatting
- **ESLint** (`.eslintrc.js`) enforces:
  - React & React‑hooks best practices.
  - TypeScript strictness.
  - Integration with Prettier.
- **Prettier** (`.prettierrc`) uses single quotes, trailing commas, no semicolons, and a 100‑character print width.

Run locally:
```bash
npm run lint          # ESLint
npm run format        # Prettier – auto‑format
npm run format:check  # Prettier check (CI uses this)
```

---

## 🌐 CI – GitHub Actions
A workflow (`.github/workflows/ci.yml`) runs on every push/PR to `main`:
- Checks out the repo.
- Sets up Node 20 and caches `npm` packages.
- Installs dependencies (`npm ci`).
- Lints (`npm run lint`).
- Type‑checks (`npx tsc --noEmit`).
- Executes the Jest test suite (`npm test`).

---

## 📂 Project Structure (high‑level)
```
movie-catalog/
├─ src/
│  ├─ api/            # React Query hooks (TMDB endpoints)
│  ├─ app/            # QueryProvider wrapper
│  ├─ navigation/    # Stack & Drawer navigators
│  ├─ screens/        # Home, Search, Results, Detail, Watchlist
│  └─ store/          # Zustand watchlist store
├─ api/tmdb/          # Vercel proxy (serverless function)
├─ eas.json           # EAS build profiles
├─ .eslintrc.js       # ESLint config
├─ .prettierrc        # Prettier config
├─ .github/workflows/ci.yml
└─ README.md (this file)
```

---

## 🚀 Future Enhancements (optional)
- **Authentication** (user accounts, synced watchlist).
- **Dark mode** support via React Native Paper theming.
- **More provider details** (prices, regional availability).
- **Unit‑test coverage** for navigation and store logic.

---

## 🙋‍♂️ Support & Contributions
Feel free to open issues or PRs. For questions, contact the repository maintainer.

---

*Generated with Claude Code*