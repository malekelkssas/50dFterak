import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui';

export function InvoicesScreen() {
    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text variant="headlineMedium">فواتيري</Text>
        </View>
    );
}
