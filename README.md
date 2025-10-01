# SalesMaster MVP — Mobile (Expo) + Server (Express)

This package contains:
- `mobile/` — Expo React Native app (4 free answers, paywall, lessons placeholders)
- `server/` — Node/Express server for Stripe Checkout + (optional) OpenAI proxy

## TL;DR: Run it now
1) **Server**: `cd server && npm install && cp .env.example .env` (fill Stripe keys) then `npm run dev`
2) **Mobile**: `cd mobile && npm install && npm run start` then open on Android with **Expo Go**

## Build a local APK
- `cd mobile && npm run prebuild`
- Open `android/` in **Android Studio**
- **Build > Build Bundle(s)/APK(s) > Build APK(s)**
- Grab the APK from `android/app/build/outputs/apk/`

## Notes
- Google login is stubbed for now; wire Firebase per `mobile/README.md`.
- Subscription check is stubbed (always inactive). After Stripe webhooks + user auth you can flip it on.
- Replace placeholder icons in `mobile/assets/`.
