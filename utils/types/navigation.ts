import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type BottomTabParamList = {
    Home: undefined;
    فواتيري: undefined;
    زبايني: undefined;
};

export type RootStackParamList = {
    MainTabs: NavigatorScreenParams<BottomTabParamList>;
    UserDetails: { userId: string };
};

export type AppNavigationProp<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type AppRouteProp<T extends keyof RootStackParamList> =
    RouteProp<RootStackParamList, T>;

export type TabNavigationProp<T extends keyof BottomTabParamList> =
    BottomTabNavigationProp<BottomTabParamList, T>;
