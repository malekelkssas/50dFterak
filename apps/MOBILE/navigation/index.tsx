import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  RootStackParamList,
  BottomTabParamList,
} from '@mobile/utils/types';
import { BottomNavigation } from '@mobile/components/ui/BottomNavigation';
import { HomeScreen } from '@mobile/screens/HomeScreen';
import { InvoicesScreen } from '@mobile/screens/InvoicesScreen';
import { CustomersScreen } from '@mobile/screens/CustomersScreen';
import { UserDetailsScreen } from '@mobile/screens/UserDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      id="MainTabs"
      tabBar={(props) => <BottomNavigation {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="فواتيري" component={InvoicesScreen} />
      <Tab.Screen name="زبايني" component={CustomersScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
    </Stack.Navigator>
  );
}
