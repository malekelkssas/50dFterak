/**
 * @format
 */

import 'react-native-gesture-handler';
import "./global.css";
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppNavigator } from '@/navigation';
import { statusBarColors, SCHEME_DARK } from '@/utils/constants';

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
  const isDarkMode = colorScheme === SCHEME_DARK;

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? statusBarColors.dark : statusBarColors.light}
      />
      <SafeAreaView className="flex-1 bg-background">
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

export default App;
