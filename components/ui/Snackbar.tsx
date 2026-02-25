import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';

export type SnackbarProps = {
    /** Whether the Snackbar is currently visible. */
    visible: boolean;
    /** Callback called when Snackbar is dismissed. */
    onDismiss: () => void;
    /** Text content of the Snackbar. */
    children: React.ReactNode;
    /** Optional action label and callback. */
    action?: {
        label: string;
        onPress: () => void;
    };
    /** Duration in milliseconds. Default is 3000ms. */
    duration?: number;
    /** Show dismiss 'x' button. Default is false. */
    showDismiss?: boolean;
    /** Additional container styling via NativeWind className */
    className?: string;
};

export function Snackbar({
    visible,
    onDismiss,
    children,
    action,
    duration = 3000,
    showDismiss = false,
    className = '',
}: SnackbarProps) {
    const { bottom } = useSafeAreaInsets();
    const [hidden, setHidden] = useState(!visible);
    const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;

    useEffect(() => {
        if (visible) {
            setHidden(false);
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            if (duration !== Number.POSITIVE_INFINITY) {
                const timer = setTimeout(() => {
                    onDismiss();
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) setHidden(true);
            });
        }
    }, [visible, duration, onDismiss]);

    if (hidden) return null;

    return (
        <Animated.View
            style={[
                { opacity, bottom: bottom + 16 },
                styles.absoluteBottom,
            ]}
            className={`rounded-md bg-foreground flex-row items-center justify-between px-4 py-3 mx-4 shadow-md elevation-4 ${className}`}
        >
            <View className="flex-1 mr-3">
                <Text variant="bodyMedium" className="!text-background">
                    {children}
                </Text>
            </View>

            {action && (
                <Pressable
                    onPress={() => {
                        action.onPress();
                        onDismiss();
                    }}
                    style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}
                >
                    <Text variant="labelLarge" className="text-primary font-bold ml-2">
                        {action.label.toUpperCase()}
                    </Text>
                </Pressable>
            )}

            {showDismiss && (
                <Pressable
                    onPress={onDismiss}
                    style={({ pressed }) => (pressed ? { opacity: 0.7 } : {})}
                    className={`${action ? 'ml-3' : 'ml-2'} p-1`}
                    hitSlop={8}
                >
                    <Text variant="bodyLarge" className="text-secondary">
                        ✕
                    </Text>
                </Pressable>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    absoluteBottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 50,
    },
});
