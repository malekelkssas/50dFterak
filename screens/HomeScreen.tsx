import React from 'react';
import { View } from 'react-native';
import { Text, Card } from '@/components/ui';
import { Logo } from '@/components/Logo';

export function HomeScreen() {

    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text variant="headlineSmall" className="mb-2">
                Fterak50d
            </Text>

            {/* Logo Section */}
            <Card mode="contained" className="w-full max-w-sm mt-6 p-4">
                <Card.Content className="items-center">
                    <Logo className="mb-4" />
                    <Text variant="headlineMedium" className="mt-4 font-bold text-center">
                        Welcome!
                    </Text>
                    <Text variant="bodyMedium" className="text-secondary mt-2 text-center">
                        Enjoy your experience with Fterak50d
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
}
