# Chewy

A mobile-first self-care pet app. Complete small real-world care goals, Chewy the baby alligator gains energy, and the lake opens up for quests, cosmetics, and streaks.

Chewy is an original name and character. It is not affiliated with any other self-care pet brand.

This first version is local-only: no backend, no payments, no push notifications, and no Apple Developer or EAS account required.

## Stack

- Expo SDK 57 + Expo Router
- TypeScript
- AsyncStorage for goals, streaks, shells, inventory, and onboarding
- React Native Animated + SVG for Chewy (blink, sway, walk) and goal confetti

## Run it

From the repo root:

```bash
npm install
npx expo start
```

Then pick one:

| Where | How |
| --- | --- |
| **Web** | Press `w`, or run `npx expo start --web` / `npm run web` |
| **Expo Go** | Install Expo Go, scan the QR code on the same network |
| **iOS simulator** | Press `i` on a Mac with Xcode |
| **Android emulator** | Press `a` with an emulator running |

Web is the fastest way to try the happy path. The layout is phone-width (max 430px) even in a desktop browser.

### Expo Go notes

v1 only uses Expo-compatible libraries (`AsyncStorage`, `react-native-svg`, `expo-linear-gradient`, vector icons). You do not need a custom native build.

If the bundler asks for a port, the default Metro port is `8081`.

## What you can do

1. **Onboarding** — welcome, pick an egg colour, tap to hatch, meet Chewy, name them (default **Chewy**), choose focus areas, optional streak goal, optional mock Plus.
2. **Home** — garden/lake backdrop, animated Chewy, energy meter, today’s goals. Completing a goal plays confetti and adds energy + shells.
3. **Quests** — timed lake outings that unlock with energy, level, streak, or focus. Short timers so you can finish them in a demo.
4. **Shop** — hats, scarves, extras, and skies priced in shells. Equipped items render on Chewy.
5. **Friends** — empty pond + invite placeholder (copies demo text; does not send mail).
6. **Profile** — streak, level, rename, mock Plus, reset demo data.

Bottom tabs: **Home · Quests · Shop · Friends · Profile**.

Plus is a dismissible preview. Nothing is billed.

## Persistence

State lives under the AsyncStorage key `chewy.v1.state`. A new calendar day rolls goals and daily quests while keeping inventory, name, colour, and streak (if you played yesterday). Use **Reset demo data** on Profile to hatch again.

## Scripts

```bash
npm run start      # Expo dev server
npm run web        # Expo web
npm run ios        # Expo Go / simulator
npm run android    # Expo Go / emulator
npm run typecheck  # tsc --noEmit
```
