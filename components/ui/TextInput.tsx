import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    TextInput as RNTextInput,
    Animated,
    Pressable,
    Text,
    type TextInputProps as RNTextInputProps,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// ── Types ───────────────────────────────────────────────────────────────

export type TextInputMode = 'flat' | 'outlined';

export interface TextInputProps extends Omit<RNTextInputProps, 'className'> {
    /** Input mode. Default: 'outlined' */
    mode?: TextInputMode;
    /** Floating label text */
    label?: string;
    /** Whether to display error styling */
    error?: boolean;
    /** Error helper text shown below the input */
    errorText?: string;
    /** Left adornment (e.g. TextInput.Icon or TextInput.Affix) */
    left?: React.ReactNode;
    /** Right adornment (e.g. TextInput.Icon or TextInput.Affix) */
    right?: React.ReactNode;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Additional NativeWind className for the wrapper */
    className?: string;
    /** Style override for the wrapper */
    style?: StyleProp<ViewStyle>;
}

// ── Animated Floating Label ─────────────────────────────────────────────

function FloatingLabel({
    label,
    isFocused,
    hasValue,
    error,
    mode,
}: {
    label: string;
    isFocused: boolean;
    hasValue: boolean;
    error: boolean;
    mode: TextInputMode;
}) {
    const animValue = useRef(new Animated.Value(hasValue || isFocused ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animValue, {
            toValue: isFocused || hasValue ? 1 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [isFocused, hasValue, animValue]);

    const translateY = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [mode === 'outlined' ? 16 : 18, mode === 'outlined' ? -8 : 4],
    });

    const fontSize = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 12],
    });

    const colorClass = error ? '#ef4444' : isFocused ? undefined : undefined;

    return (
        <Animated.Text
            style={[
                {
                    position: 'absolute',
                    left: mode === 'outlined' ? 14 : 0,
                    transform: [{ translateY }],
                    fontSize,
                    color: colorClass,
                    zIndex: 1,
                },
            ]}
            className={`${error ? 'text-red-500' : isFocused ? 'text-primary' : 'text-secondary'
                } ${mode === 'outlined' ? 'bg-muted px-1' : ''}`}
        >
            {label}
        </Animated.Text>
    );
}

// ── TextInput Component ─────────────────────────────────────────────────

function TextInputRoot({
    mode = 'outlined',
    label,
    error = false,
    errorText,
    left,
    right,
    disabled = false,
    className = '',
    style,
    value,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
    ...rnProps
}: TextInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!(value && value.length > 0);

    const handleFocus = useCallback(
        (e: any) => {
            setIsFocused(true);
            onFocusProp?.(e);
        },
        [onFocusProp],
    );

    const handleBlur = useCallback(
        (e: any) => {
            setIsFocused(false);
            onBlurProp?.(e);
        },
        [onBlurProp],
    );

    const modeWrapperClass =
        mode === 'outlined'
            ? `border rounded-md px-3 pt-4 pb-2 ${error
                ? 'border-red-500'
                : isFocused
                    ? 'border-primary border-2'
                    : 'border-secondary/40'
            }`
            : `border-b pt-5 pb-2 ${error
                ? 'border-red-500'
                : isFocused
                    ? 'border-primary border-b-2'
                    : 'border-secondary/40'
            }`;

    return (
        <View className={`${className}`} style={style}>
            <View
                className={`relative flex-row items-center ${modeWrapperClass} ${disabled ? 'opacity-50' : ''
                    } bg-muted`}
            >
                {left && <View className="mr-2">{left}</View>}
                <View className="flex-1 relative">
                    {label && (
                        <FloatingLabel
                            label={label}
                            isFocused={isFocused}
                            hasValue={hasValue}
                            error={error}
                            mode={mode}
                        />
                    )}
                    <RNTextInput
                        {...rnProps}
                        value={value}
                        editable={!disabled}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={`text-foreground text-base ${label ? 'pt-2' : ''}`}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                {right && <View className="ml-2">{right}</View>}
            </View>
            {error && errorText && (
                <Text className="text-red-500 text-xs mt-1 ml-3">{errorText}</Text>
            )}
        </View>
    );
}

// ── TextInput.Icon ──────────────────────────────────────────────────────

export interface TextInputIconProps {
    /** Icon element to render */
    icon: React.ReactNode;
    /** Callback when the icon is pressed */
    onPress?: () => void;
    /** Additional styles for the icon wrapper */
    style?: StyleProp<ViewStyle>;
}

function TextInputIcon({ icon, onPress, style }: TextInputIconProps) {
    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                className="p-1"
                style={style}
                hitSlop={8}
                accessibilityRole="button"
            >
                {icon}
            </Pressable>
        );
    }
    return <View className="p-1" style={style}>{icon}</View>;
}

// ── TextInput.Affix ─────────────────────────────────────────────────────

export interface TextInputAffixProps {
    /** Text to display as prefix/suffix (e.g. "$", ".com") */
    text: string;
    /** Custom style for the text */
    textStyle?: StyleProp<import('react-native').TextStyle>;
}

function TextInputAffix({ text, textStyle }: TextInputAffixProps) {
    return <Text style={textStyle} className="text-secondary text-base">{text}</Text>;
}

// ── Compose ─────────────────────────────────────────────────────────────

export const TextInput = Object.assign(TextInputRoot, {
    Icon: TextInputIcon,
    Affix: TextInputAffix,
});
