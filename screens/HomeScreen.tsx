import React from 'react';
import { View } from 'react-native';
import { Text, Card } from '@/components/ui';

export function HomeScreen() {

    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text variant="headlineSmall" className="mb-2">
                Fterak50d
            </Text>

            {/* Duck Section */}
            <Card mode="contained" className="w-full max-w-sm mt-6 p-4">
                <Card.Content className="items-center">
                    <Text className="text-5xl p-4">🦆</Text>
                    <Text variant="headlineMedium" className="mt-4 font-bold text-center">
                        Quack Quack!
                    </Text>
                    <Text variant="bodyMedium" className="text-secondary mt-2 text-center">
                        Your friendly duck is here to keep you company 🎶
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
}
