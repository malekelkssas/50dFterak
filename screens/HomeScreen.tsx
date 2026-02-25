import React, { useState } from 'react';
import { View } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Text, Button, Card, Snackbar } from '@/components/ui';

import { useCounterSlice } from '@/hooks';

export function HomeScreen() {
    const { count, increment, decrement, reset, restore } = useCounterSlice();
    const [snackbarVisible, setSnackbarVisible] = useState(false);

    const handleReset = () => {
        reset();
        setSnackbarVisible(true);
    };

    return (
        <View className="flex-1 bg-background items-center justify-center p-4">
            <Text variant="headlineSmall" className="mb-2">
                Fterak50d
            </Text>

            {/* Redux Persist Demo */}
            <Card mode="contained" className="w-full max-w-sm mb-8 mt-4 p-4">
                <Card.Content className="items-center">
                    <Text variant="titleMedium" className="mb-4">
                        Redux Persist Demo
                    </Text>
                    <Text variant="displayLarge" className="text-primary mb-6 font-bold">
                        {count}
                    </Text>

                    <View className="flex-row items-center justify-center gap-4 mb-4">
                        <Button mode="contained" onPress={decrement}>
                            -1
                        </Button>
                        <Button mode="outlined" onPress={handleReset}>
                            Reset
                        </Button>
                        <Button mode="contained" onPress={increment}>
                            +1
                        </Button>
                    </View>
                    <Text variant="bodySmall" className="text-secondary text-center mt-2">
                        Increment this counter, then reload the app (press R). The state will persist!
                    </Text>
                </Card.Content>
            </Card>

            <Text variant="bodyMedium" className="text-secondary mb-4">
                Choose your theme
            </Text>
            <ThemeToggle />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                showDismiss
                action={{
                    label: 'Undo',
                    onPress: restore,
                }}
            >
                Counter has been reset!
            </Snackbar>
        </View>
    );
}
