import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/utils/types';
import { SCREENS } from '@/utils/constants';
import { HomeScreen } from '@/screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={SCREENS.HOME}
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
        </Stack.Navigator>
    );
}
