import React from 'react';
import {
    Pressable,
    View,
    type PressableProps,
} from 'react-native';
import { Text } from './Text';
import { ActivityIndicator } from './ActivityIndicator';

export type ButtonMode = 'text' | 'outlined' | 'contained';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
    /** Mode of the button. Default: 'text' */
    mode?: ButtonMode;
    /** Whether to show a loading indicator */
    loading?: boolean;
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Icon element to display before the label */
    icon?: React.ReactNode;
    /** Additional className for the button container */
    className?: string;
    /** Additional className for the label text */
    labelClassName?: string;
    /** Label text or children */
    children: React.ReactNode;
}

const modeClasses: Record<ButtonMode, string> = {
    text: 'bg-transparent',
    outlined: 'bg-transparent border border-primary',
    contained: 'bg-primary',
};

const modeLabelClasses: Record<ButtonMode, string> = {
    text: 'text-primary',
    outlined: 'text-primary',
    contained: 'text-white',
};

export function Button({
    mode = 'text',
    loading = false,
    disabled = false,
    icon,
    className = '',
    labelClassName = '',
    children,
    ...pressableProps
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const containerClass = [
        'flex-row items-center justify-center rounded-full px-6 py-3',
        modeClasses[mode],
        isDisabled ? 'opacity-50' : '',
        className,
    ].filter(Boolean).join(' ');

    const labelClass = [
        'text-sm font-semibold',
        modeLabelClasses[mode],
        labelClassName,
    ].filter(Boolean).join(' ');

    return (
        <Pressable
            {...pressableProps}
            disabled={isDisabled}
            className={containerClass}
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled }}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={mode === 'contained' ? '#ffffff' : undefined}
                    className="mr-2"
                />
            ) : icon ? (
                <View className="mr-2">{icon}</View>
            ) : null}
            {typeof children === 'string' ? (
                <Text className={labelClass}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}
