# Navigation Setup Guide

## Architecture

```
navigation/
  AppNavigator.tsx     ← Stack navigator (typed with RootStackParamList)
  index.ts             ← Barrel export

screens/
  HomeScreen.tsx       ← Screen components

utils/
  constants/
    navigation.ts      ← SCREENS object (SCREENS.HOME, etc.)
  types/
    navigation.ts      ← RootStackParamList, typed nav/route props
  helpers/
    navigation.ts      ← buildRoute(), buildDeepLink()
```

---

## How to Add a New Screen

### 1. Add to the SCREENS constant

```ts
// utils/constants/navigation.ts
export const SCREENS = {
  HOME: 'Home',
  PROFILE: 'Profile',  // ← new
} as const;
```

### 2. Add params to the type map

```ts
// utils/types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };  // ← new
};
```

### 3. Create the screen component

```tsx
// screens/ProfileScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui';
import type { AppRouteProp } from '@/utils/types';

interface Props {
  route: AppRouteProp<'Profile'>;
}

export function ProfileScreen({ route }: Props) {
  const { userId } = route.params;
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text variant="headlineSmall">Profile: {userId}</Text>
    </View>
  );
}
```

### 4. Register in the navigator

```tsx
// navigation/AppNavigator.tsx
import { ProfileScreen } from '@/screens/ProfileScreen';

<Stack.Screen name={SCREENS.PROFILE} component={ProfileScreen} />
```

---

## Navigating Between Screens

```tsx
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '@/utils/types';
import { SCREENS } from '@/utils/constants';

function SomeComponent() {
  const navigation = useNavigation<AppNavigationProp<'Home'>>();

  const goToProfile = () => {
    navigation.navigate(SCREENS.PROFILE, { userId: '123' });
  };
}
```

---

## Dynamic Routes with buildRoute / buildDeepLink

Useful for notifications, deep links, or passing routes as data:

```tsx
import { buildRoute, buildDeepLink } from '@/utils/helpers';

// Route object
buildRoute('Profile', { userId: '123' })
// => { screen: 'Profile', params: { userId: '123' } }

// Deep link path
buildDeepLink('Profile', { userId: '123' })
// => '/Profile/123'
```

---

## Key Considerations

| Topic | Detail |
|---|---|
| **Gesture Handler** | `import 'react-native-gesture-handler'` must be at the top of `App.tsx` |
| **Reanimated Plugin** | Must be the **last** plugin in `babel.config.js` |
| **Metro Restart** | Restart after adding screens or changing babel config |
| **Screen Names** | Always use `SCREENS.XXX`, never hardcode strings |
| **Type Safety** | `RootStackParamList` enforces correct params at compile time |
| **Android Rebuild** | Rebuild after installing native deps: `pnpm android:clean && pnpm android:build-debug` |
