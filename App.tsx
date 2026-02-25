/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import "./global.css";
import { StatusBar, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Text } from '@/components/ui';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppShell() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0a0a0a' : '#ffffff'}
      />
      <SafeAreaView className="flex-1 bg-background">
        <AppContent />
      </SafeAreaView>
    </>
  );
}

function AppContent() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <Text variant="headlineSmall" className="mb-2">
        Fterak50d
      </Text>
      <Text variant="bodyMedium" className="text-secondary mb-8">
        Choose your theme
      </Text>
      <ThemeToggle />
    </View>
  );
}

export default App;
