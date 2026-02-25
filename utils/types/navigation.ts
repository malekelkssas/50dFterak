import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

/**
 * Root stack param list.
 * Maps screen names to their expected params (or undefined if none).
 * Add new screens here as the app grows.
 */
export type RootStackParamList = {
    Home: undefined;
    فواتيري: undefined;
    زبايني: undefined;
};

/** Typed navigation prop for any screen in the root stack */
export type AppNavigationProp<T extends keyof RootStackParamList> =
    BottomTabNavigationProp<RootStackParamList, T>;

/** Typed route prop for any screen in the root stack */
export type AppRouteProp<T extends keyof RootStackParamList> =
    RouteProp<RootStackParamList, T>;
