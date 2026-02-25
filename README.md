# Fterak50d

A React Native app with NativeWind (Tailwind CSS) and dynamic light/dark theming.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start Metro bundler
pnpm start

# Build & install debug APK
pnpm android:build-debug
pnpm android:install-debug

# Reconnect Metro to device
pnpm adb:reconnect
```

## Available Scripts

| Script | Description |
|---|---|
| `pnpm start` | Start Metro bundler |
| `pnpm android` | Build & run on Android |
| `pnpm android:clean` | Clean Android build |
| `pnpm android:build-debug` | Build debug APK |
| `pnpm android:build-release` | Build release APK |
| `pnpm android:install-debug` | Install debug APK via ADB |
| `pnpm android:install-release` | Install release APK via ADB |
| `pnpm adb:reconnect` | Reconnect Metro to device (`adb reverse`) |
| `pnpm ios` | Build & run on iOS |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |

---

## Project Setup Guide

> Full setup reference: [react-native-setup-notes.md](./docs/react-native-setup-notes.md)

### 1. Project Initialization

```bash
npx @react-native-community/cli@latest init <project-name>
```

### 2. Core Dependencies

```bash
# NativeWind + supporting libs
pnpm add nativewind react-native-reanimated react-native-safe-area-context react-native-worklets
pnpm add --save-dev tailwindcss@^3.4.17 prettier-plugin-tailwindcss@^0.5.11

# Path alias support
pnpm add -D babel-plugin-module-resolver
```

> **Note:** If you encounter issues with nested packages, use:
> ```bash
> pnpm install --shamefully-hoist
> ```

### 3. Configuration Files

**Initialize Tailwind:**
```bash
npx tailwindcss init
```

**`tailwind.config.js`** — see [Theme Setup](#theme-setup) below for the full config with theme colors.

**`babel.config.js`:**
```js
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    ['module-resolver', { root: ['.'], alias: { '@': '.' } }],
  ],
};
```

**`metro.config.js`:**
```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require("nativewind/metro");

const config = mergeConfig(getDefaultConfig(__dirname), {});
module.exports = withNativeWind(config, { input: "./global.css" });
```

**`tsconfig.json`** — add path aliases:
```json
"baseUrl": ".",
"paths": { "@/*": ["./*"] }
```

### 4. Required Files

**`global.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`nativewind-env.d.ts`:**
```ts
/// <reference types="nativewind/types" />
```

Then import `global.css` at the top of `App.tsx`:
```ts
import "./global.css";
```

### 5. Android Setup

**`android/local.properties`:**
```
sdk.dir=/home/<your-username>/Android/Sdk
```

> ⚠️ Adding `org.gradle.configuration-cache=true` to `android/gradle.properties` **breaks** the clean build command — avoid it.

---

## Theme Setup

> Full theme reference: [theme-setup.md](./docs/theme-setup.md)

### Architecture

> **⚠️ Key Gotcha:** CSS `:root` / `.dark` selectors do NOT work on React Native. They only work on web. On native, you must use NativeWind's `vars()` function via a `ThemeProvider` wrapper.

```
tailwind.config.js  ──→  defines color tokens using CSS vars
ThemeProvider        ──→  injects variable values via vars() (native)
ThemeToggle          ──→  toggleColorScheme()
```

### 1. Color Tokens (`tailwind.config.js`)

```js
module.exports = {
  darkMode: "class",
  // ...
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
      },
    },
  },
};
```

### 2. ThemeProvider (`components/ThemeProvider.tsx`)

Uses NativeWind's `vars()` to inject CSS variable values on native:

```tsx
import { View } from 'react-native';
import { vars, useColorScheme } from 'nativewind';

const lightTheme = vars({ '--color-background': '255 255 255', /* ... */ });
const darkTheme = vars({ '--color-background': '10 10 10', /* ... */ });

export function ThemeProvider({ children }) {
  const { colorScheme } = useColorScheme();
  return (
    <View style={colorScheme === 'dark' ? darkTheme : lightTheme} className="flex-1">
      {children}
    </View>
  );
}
```

### 3. Wrap App

```tsx
<SafeAreaProvider>
  <ThemeProvider>
    <SafeAreaView className="flex-1 bg-background">
      {/* all children auto-switch colors */}
    </SafeAreaView>
  </ThemeProvider>
</SafeAreaProvider>
```

### Color Token Reference

| Token | Class | Light | Dark |
|---|---|---|---|
| background | `bg-background` | white | near-black |
| foreground | `text-foreground` | near-black | near-white |
| primary | `bg-primary` / `text-primary` | blue-500 | blue-400 |
| secondary | `text-secondary` | slate-500 | slate-400 |
| muted | `bg-muted` | slate-100 | slate-800 |
| accent | `bg-accent` | indigo-500 | indigo-400 |

### Usage

No `dark:` prefix needed — tokens auto-switch:

```tsx
<View className="bg-background">
  <Text className="text-foreground">Auto-themed text</Text>
  <Text className="text-secondary">Subtle text</Text>
</View>
```

### Key Considerations

| Topic | Detail |
|---|---|
| **Web vs Native** | `global.css` variables work on web; `ThemeProvider` with `vars()` needed on native |
| **Adding new colors** | Add to 3 places: `tailwind.config.js`, `ThemeProvider`, and `global.css` (web) |
| **StatusBar** | Handle separately with `barStyle` and `backgroundColor` props |
| **SafeAreaView** | Use from `react-native-safe-area-context`, not `react-native` (deprecated) |
| **Metro restart** | Always restart Metro after changing `tailwind.config.js` or `global.css` |

---

## State Management (Redux)

> Full Redux reference: [redux-setup.md](./docs/redux-setup.md)

Uses Redux Toolkit, Redux Persist (with AsyncStorage), and state encryption.

### Structure

```
hooks/
  useStore.ts        ← Typed useAppDispatch / useAppSelector
store/
  index.ts           ← Store, Persist, and Encryption config
  slices/
    counterSlice.ts  ← Example slice
```

To copy your web slices over, just paste them into `store/slices` and register them in `store/index.ts`. All thunks and reducers work exactly the same.

---

## Environment Variables

> Full Env setup reference: [env-setup.md](./docs/env-setup.md)

React Native doesn't have a built-in `process.env`. This project uses `react-native-dotenv` to inject variables natively.
1. Add variables to your `.env` file (e.g. `REDUX_PERSIST_SECRET_KEY=my-secret`)
2. Add type definitions in `utils/types/env.d.ts` under the `'@env'` module.
3. Access them securely via the single-source-of-truth export at `utils/constants/env.ts`.

> **Note:** Whenever you change your `.env` file, you **must clear the Metro cache** for it to take effect: `pnpm start --reset-cache`.

---

## Navigation

> Full navigation reference: [navigation-setup.md](./docs/navigation-setup.md)

Uses [React Navigation](https://reactnavigation.org/) native stack with full TypeScript support.

### Structure

```
navigation/AppNavigator.tsx   ← Stack navigator
screens/HomeScreen.tsx        ← Screen components
utils/constants/navigation.ts ← SCREENS object
utils/types/navigation.ts     ← RootStackParamList
utils/helpers/navigation.ts   ← buildRoute(), buildDeepLink()
```

### Screen Names

All screen names live in a single `SCREENS` constant object:

```ts
import { SCREENS } from '@/utils/constants';

SCREENS.HOME     // 'Home'
// SCREENS.PROFILE  // 'Profile' (add as needed)
```

### Navigating

```tsx
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '@/utils/types';
import { SCREENS } from '@/utils/constants';

const navigation = useNavigation<AppNavigationProp<'Home'>>();
navigation.navigate(SCREENS.PROFILE, { userId: '123' });
```

### Dynamic Routes

```tsx
import { buildRoute, buildDeepLink } from '@/utils/helpers';

buildRoute('Profile', { userId: '123' })    // => { screen, params }
buildDeepLink('Profile', { userId: '123' }) // => '/Profile/123'
```

### Adding a New Screen

1. Add to `SCREENS` in `utils/constants/navigation.ts`
2. Add params to `RootStackParamList` in `utils/types/navigation.ts`
3. Create component in `screens/`
4. Register in `navigation/AppNavigator.tsx`

---

## Realm Schema Migrations

> Full migration guide: [realm-schema-migrations-guide.md](./docs/realm-schema-migrations-guide.md)

Detailed instructions for managing database schema updates, incrementing versions, and handling data transforms.

---

## Useful Commands

```bash
# Reconnect Metro to mobile device
adb reverse tcp:8081 tcp:8081

# List available Java versions (Arch Linux)
archlinux-java status

# Switch Java version (Arch Linux)
sudo archlinux-java set java-17-openjdk
```

---

## References

- [React Navigation Docs](https://reactnavigation.org/docs/getting-started)
- [NativeWind Docs (Frameworkless)](https://www.nativewind.dev/docs/getting-started/installation/frameworkless)
- [NativeWind Themes Guide](https://www.nativewind.dev/docs/guides/themes)
- [NativeWind Dark Mode](https://www.nativewind.dev/docs/core-concepts/dark-mode)
- [React Native Paper](https://oss.callstack.com/react-native-paper/docs/components/Badge)
