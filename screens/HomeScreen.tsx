import React from 'react';
import { View } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Text } from '@/components/ui';

export function HomeScreen() {
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
