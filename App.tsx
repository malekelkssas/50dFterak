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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AppNavigator } from '@/navigation';
import { statusBarColors, SCHEME_DARK } from '@/utils/constants';
import { PortalHost } from '@/components/ui/Portal';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider>
            <PortalHost>
              <AppShell />
            </PortalHost>
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

function AppShell() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === SCHEME_DARK;

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
        backgroundColor={isDarkMode ? statusBarColors.light : statusBarColors.dark}
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
