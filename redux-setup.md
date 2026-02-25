# React Native Redux Store Migration Guide (Web → Metro RN)

This guide explains how the Redux + Persist + Encryption setup was ported from Web (`localStorage`) to React Native Metro (`AsyncStorage`).

## 1. Dependencies

```bash
# Core
pnpm add @reduxjs/toolkit react-redux redux-persist redux-persist-transform-encrypt

# Storage Adapter (Use 1.24.0, as v3+ can cause 'storage-android' build errors)
pnpm add @react-native-async-storage/async-storage@1.24.0

# Utilities
pnpm add -D @types/react-redux react-native-dotenv
pnpm add react-native-get-random-values
```

> **Important:** `redux-persist-transform-encrypt` requires a crypto random number generator, which React Native lacks by default.  
> You **must** import the polyfill at the absolute top of your `index.js` file:
> ```js
> import 'react-native-get-random-values';
> import { AppRegistry } from 'react-native';
> ```

## 2. Environment Variables

Metro does not support `import.meta.env`. We use `react-native-dotenv` and a centralized `ENV` constant.
See [env-setup.md](./env-setup.md) for full configuration details.

**`.env`:**
```
REDUX_PERSIST_SECRET_KEY=my-super-secret-key-123
```

## 3. Store Config & Storage Adapter

The main difference from Web is swapping `storage` from `redux-persist/lib/storage` (which is `localStorage`) to `@react-native-async-storage/async-storage`.

**`store/index.ts`:**
```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { ENV } from '@/utils/constants';

import counterReducer from './slices/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,                 // ← React Native Storage
  whitelist: ['counter'],                // ← Slices to persist
  transforms: [
    encryptTransform({
      secretKey: ENV.REDUX_PERSIST_SECRET_KEY || 'fallback',
      onError: (error) => console.error('Encryption error:', error),
    }),
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
```

## 4. App Integration

Wrap the root navigator with `<Provider>` and `<PersistGate>`.

**`App.tsx`:**
```tsx
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* ... Rest of your app (SafeAreaProvider, ThemeProvider, AppNavigator) ... */}
      </PersistGate>
    </Provider>
  );
}
```

## 5. Usage in Components (Feature Hooks)

Instead of using `useAppDispatch` and `useAppSelector` directly in your UI components, create a custom "feature hook" for each slice in `hooks/features/`. 

This encapsulates the Redux logic and keeps components clean.

**`hooks/features/useCounterSlice.ts`:**
```tsx
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { increment, decrement, reset } from '@/store/slices/counterSlice';

export function useCounterSlice() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return {
    count,
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement()),
    reset: () => dispatch(reset()),
  };
}
```

**`screens/MyComponent.tsx`:**
```tsx
import { useCounterSlice } from '@/hooks';

export function MyComponent() {
  const { count, increment } = useCounterSlice();

  return (
    <Button onPress={increment}>
      Count: {count}
    </Button>
  );
}
```

## TL;DR Differences from Web

1. **Storage:** Replace `redux-persist/lib/storage` with `@react-native-async-storage/async-storage`.
2. **Env Vars:** Replace `import.meta.env.*` with `react-native-dotenv` + centralized `ENV` constant.
3. **Usage Pattern:** Wrap slices in custom hooks (e.g. `useCounterSlice`) instead of importing slice actions directly into UI.
4. **Slices/Thunks:** 100% identical. You can copy/paste your web slices (`authSlice`, `classesSlice`) directly into RN.
