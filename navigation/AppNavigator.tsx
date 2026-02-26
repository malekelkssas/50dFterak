import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BottomTabParamList, RootStackParamList } from '@/utils/types';
import { SCREENS } from '@/utils/constants';
import { HomeScreen } from '@/screens/HomeScreen';
import { InvoicesScreen } from '@/screens/InvoicesScreen';
import { CustomersScreen } from '@/screens/CustomersScreen';
import { UserDetailsScreen } from '@/screens/UserDetailsScreen';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { useColorScheme } from 'nativewind';
import { SCHEME_DARK } from '@/utils/constants';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={SCREENS.HOME}
            tabBar={(props) => <BottomNavigation {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: 'transparent' },
            }}
        >
            <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
            <Tab.Screen name={SCREENS.INVOICES} component={InvoicesScreen} />
            <Tab.Screen name={SCREENS.CUSTOMERS} component={CustomersScreen} />
        </Tab.Navigator>
    );
}

export function AppNavigator() {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === SCHEME_DARK;

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }
            }}
        >
            <Stack.Screen name={SCREENS.MAIN_TABS} component={TabNavigator} />
            <Stack.Screen name={SCREENS.USER_DETAILS} component={UserDetailsScreen} />
        </Stack.Navigator>
    );
}

