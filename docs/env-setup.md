# Environment Variables Setup Guide

React Native doesn't have a built-in `process.env` like Node.js or `import.meta.env` like Web.
We use [`react-native-dotenv`](https://github.com/goatandsheep/react-native-dotenv) to inject variables securely.

## 1. Setup

**`babel.config.js`:**
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    // ... other plugins ...
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
    'react-native-reanimated/plugin', // MUST BE LAST
  ],
};
```

**Types (`types/env.d.ts`):**
```typescript
declare module '@env' {
  export const REDUX_PERSIST_SECRET_KEY: string;
  // export const API_URL: string;
}
```

## 2. Usage

Always access variables via the centralized `ENV` object in `utils/constants/env.ts`.
This ensures type-safety and single-source-of-truth.

**`utils/constants/env.ts`:**
```typescript
import { REDUX_PERSIST_SECRET_KEY } from '@env';

export const ENV = {
  REDUX_PERSIST_SECRET_KEY,
} as const;
```

**Anywhere in the app:**
```typescript
import { ENV } from '@/utils/constants';

console.log(ENV.REDUX_PERSIST_SECRET_KEY);
```

## Note on Cache

If you change `.env`, you **must clear the Metro cache** for the changes to apply:
```bash
pnpm start --reset-cache
```
