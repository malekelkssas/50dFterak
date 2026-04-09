import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Card, Button } from '@/components/ui';
import { Logo } from '@/components/Logo';
import type { AppNavigationProp } from '@/utils/types';
import { SCREENS, PRICING_STRINGS } from '@/utils/constants';

export function HomeScreen() {
  const navigation = useNavigation<AppNavigationProp<'MainTabs'>>();

  return (
    <View className="bg-background flex-1 items-center justify-center p-4">
      <Text variant="headlineSmall" className="mb-2">
        Fterak50d
      </Text>

      {/* Logo Section */}
      <Card mode="contained" className="mt-6 w-full max-w-sm p-4">
        <Card.Content className="items-center">
          <Logo className="mb-4" />
          <Text variant="headlineMedium" className="mt-4 text-center font-bold">
            Welcome!
          </Text>
          <Text
            variant="bodyMedium"
            className="text-secondary mt-2 text-center"
          >
            Enjoy your experience with Fterak50d
          </Text>
          <Button
            mode="outlined"
            className="mt-6 min-h-12 w-full"
            onPress={() => navigation.navigate(SCREENS.GLOBAL_FLOUR_PRICE)}
            accessibilityLabel={`${PRICING_STRINGS.en.screenTitle}, ${PRICING_STRINGS.ar.screenTitle}`}
          >
            {PRICING_STRINGS.ar.screenTitle}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
