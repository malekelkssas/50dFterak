/**
 * @format
 */

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { ThemeProvider } from '@mobile/components/ThemeProvider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@mobile/store';
import { AppNavigator } from '@mobile/navigation';
import { statusBarColors, SCHEME_DARK } from '@mobile/utils/constants';
import { PortalHost } from '@mobile/components/ui/Portal';

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
        backgroundColor={
          isDarkMode ? statusBarColors.light : statusBarColors.dark
        }
      />
      <SafeAreaView className="bg-background flex-1">
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}

export default App;
