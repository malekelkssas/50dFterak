# React Native + NativeWind Setup Guide

## 1. Project Initialization

```bash
npx @react-native-community/cli@latest init <project-name>
```

---

## 2. Core Dependencies

```bash
# Better JSON serialization
npm i superjson

# Standalone mobile database
npm i realm

# NativeWind (Tailwind for React Native) + supporting libs
pnpm add nativewind react-native-reanimated react-native-safe-area-context react-native-worklets
pnpm add --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11

# Path alias support
pnpm add -D babel-plugin-module-resolver
```

> **Note:** If you encounter issues with nested packages, use:
> ```bash
> pnpm install --shamefully-hoist
> ```
> This forces all nested packages to be hoisted to the top-level `node_modules` — fixes errors like `Included build '.../@react-native/gradle-plugin' does not exist.`

---

## 3. Configuration Files

### Initialize Tailwind

```bash
npx tailwindcss init
```

Then modify the generated `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```
> ⚠️ Make sure `content` paths are correct — wrong paths cause a **black screen**.

### `babel.config.js`
```js
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': '.',
        },
      },
    ],
  ],
};
```

### `metro.config.js`
```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativeWind(config, { input: "./global.css" });
```

### `tsconfig.json` — Path Aliases
Add inside `compilerOptions`:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

---

## 4. Required Files to Create

### `global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `nativewind-env.d.ts`
```ts
/// <reference types="nativewind/types" />
```

Then import `global.css` at the top of `App.tsx`:
```ts
import "./global.css";
```

---

## 5. Android Setup

### SDK Path — `android/local.properties`
```
sdk.dir=/home/<your-username>/Android/Sdk
```

### Build & Install

```bash
# Build debug APK
./gradlew assembleDebug

# Install or update on connected device
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Release build (does not depend on Metro)
./gradlew assembleRelease
```

> **Note:** Adding `org.gradle.configuration-cache=true` to `android/gradle.properties` **breaks** the clean build command — avoid it.

---

## 6. Useful Commands

```bash
# Reconnect Metro to mobile device
adb reverse tcp:8081 tcp:8081

# List available Java versions (Arch Linux)
archlinux-java status

# Switch Java version (Arch Linux)
sudo archlinux-java set java-17-openjdk

# iOS pod install (macOS only)
npx pod-install
```

---

## 7. Cleanup

- Remove the `@react-native/new-app-screen` package entirely.

---

## References
- [NativeWind Docs (Frameworkless)](https://www.nativewind.dev/docs/getting-started/installation/frameworkless)
- [React Native Paper](https://oss.callstack.com/react-native-paper/docs/components/Badge)
