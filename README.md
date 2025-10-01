# SalesMaster (Expo React Native)

This is a minimal, working **MVP**:
- 4 free AI answers, then paywall
- Placeholder lessons
- "Subscribe" opens Stripe Checkout (via the server)
- Google login placeholder (wire up Firebase GoogleAuth to go live)

## Quick Start
1) Install prereqs: Node 18+, Yarn or npm, Android Studio (SDK + emulator)  
2) `cd mobile`  
3) `npm install` (or `yarn`)  
4) Start app: `npm run start` and use **Expo Go** on Android (scan QR) or run emulator.

## Build a real APK (local, no cloud)
1) Prebuild native project: `npm run prebuild`  
2) Open `android/` in **Android Studio**  
3) From *Build* menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**  
4) Find the APK at `android/app/build/outputs/apk/release/` (or debug under `.../debug/`).  
   - To sign a release APK: create a keystore (Build > Generate Signed Bundle/APK) and set gradle signing config.

## Configure Firebase Google Login
- In Firebase Console, create a project and enable **Google** provider.
- Create Android app with package `com.yourcompany.salesmaster` (or change in `app.json`).
- Download `google-services.json` to `android/app/` after prebuild.
- Fill `extra.firebaseConfig` in `app.json` with your Firebase keys.
- Replace `handleGoogleSignIn` with a real flow (expo-auth-session or native).

## Point the app to your server
- `app.json` > `extra.apiUrl`: for *Android emulator* use `http://10.0.2.2:4242`; for a physical device on same Wi‑Fi, use your machine's LAN IP, e.g., `http://192.168.1.10:4242`.

