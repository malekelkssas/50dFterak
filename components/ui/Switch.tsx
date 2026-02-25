import React from 'react';
import { Switch as NativeSwitch, Platform } from 'react-native';
import { useColorScheme } from 'nativewind';

export interface SwitchProps {
    /**
     * Value of the switch, true means 'on', false means 'off'.
     */
    value: boolean;
    /**
     * Callback called with the new value when it changes.
     */
    onValueChange: (value: boolean) => void;
    /**
     * Disabled state of the switch.
     */
    disabled?: boolean;
    /**
     * Custom color for switch (tint/thumb color usually).
     */
    color?: string;
}

/**
 * Switch component. Use this instead of the core React Native Switch
 * because it automatically binds your app theme colors.
 */
export function Switch({ value, onValueChange, disabled, color }: SwitchProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // The primary color should match the hex of your tailwind primary variable.
    // If you need it exact, it's best to feed via `color` prop from context, 
    // but a solid default is `#0ea5e9` for primary if using a standard theme, 
    // or adapting natively. Let's use a standard accessible blue primary as fallback.
    const activeColor = color || (isDark ? '#38bdf8' : '#0284c7');

    return (
        <NativeSwitch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{
                false: isDark ? '#3f3f46' : '#e4e4e7', // zinc-700 / zinc-200
                true: Platform.OS === 'ios' ? activeColor : `${activeColor}80`, // lighter transparency on android true
            }}
            thumbColor={
                Platform.OS === 'android'
                    ? value
                        ? activeColor
                        : isDark
                            ? '#a1a1aa'
                            : '#f4f4f5'
                    : undefined // iOS uses default thumb
            }
            ios_backgroundColor={isDark ? '#3f3f46' : '#e4e4e7'}
        />
    );
}
