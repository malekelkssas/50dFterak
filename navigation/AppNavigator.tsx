import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootStackParamList } from '@/utils/types';
import { SCREENS } from '@/utils/constants';
import { HomeScreen } from '@/screens/HomeScreen';
import { InvoicesScreen } from '@/screens/InvoicesScreen';
import { CustomersScreen } from '@/screens/CustomersScreen';
import { BottomNavigation } from '@/components/ui/BottomNavigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

export function AppNavigator() {
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
