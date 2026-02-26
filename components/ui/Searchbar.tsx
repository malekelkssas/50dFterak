import React, { forwardRef } from 'react';
import {
    View,
    TextInput as NativeTextInput,
    Pressable,
    StyleSheet,
    type TextInputProps as NativeTextInputProps,
    type StyleProp,
    type ViewStyle,
    type TextStyle,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { ActivityIndicator } from './ActivityIndicator';

export interface SearchbarProps extends NativeTextInputProps {
    /**
     * Value of the text input.
     */
    value: string;
    /**
     * Callback that is called when the text input's text changes.
     */
    onChangeText: (query: string) => void;
    /**
     * Placeholder text for the text input.
     */
    placeholder?: string;
    /**
     * Callback to execute when the clear icon is pressed.
     */
    onClearIconPress?: () => void;
    /**
     * Callback to execute when the search icon is pressed.
     */
    onIconPress?: () => void;
    /**
     * Callback to execute when the input is pressed.
     */
    onPress?: () => void;
    /**
     * Custom search icon element.
     */
    icon?: React.ReactNode;
    /**
     * Custom clear icon element.
     */
    clearIcon?: React.ReactNode;
    /**
     * Additional native style for the container.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Additional native style for the text input.
     */
    inputStyle?: StyleProp<TextStyle>;
    /**
     * Additional tailwind classes for the container.
     */
    className?: string;
    /**
     * Color of the search icon.
     */
    iconColor?: string;
    /**
     * Whether or not to show the loading indicator instead of the search icon.
     */
    loading?: boolean;
    /**
     * Whether the Searchbar elevation is active.
     */
    elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * Searchbar is a simple input box with search and clear icons.
 */
export const Searchbar = forwardRef<NativeTextInput, SearchbarProps>(
    (
        {
            value,
            onChangeText,
            placeholder = 'Search',
            onClearIconPress,
            onIconPress,
            onPress,
            icon,
            clearIcon,
            style,
            inputStyle,
            className = '',
            iconColor,
            loading = false,
            elevation = 1,
            ...rest
        },
        ref
    ) => {
        const { colorScheme } = useColorScheme();
        const isDark = colorScheme === 'dark';

        const defaultIconColor = iconColor || (isDark ? '#9ca3af' : '#64748b'); // outline color

        const handleClearPress = () => {
            onChangeText('');
            onClearIconPress?.();
        };

        const hasValue = value.length > 0;

        return (
            <Pressable
                onPress={onPress}
                style={[
                    styles.container,
                    {
                        elevation,
                        shadowOpacity: elevation * 0.04,
                        shadowRadius: elevation,
                        shadowOffset: { width: 0, height: elevation * 0.5 },
                    },
                    style,
                ]}
                className={`flex-row items-center rounded-full bg-surface ${elevation > 0 ? '' : 'border border-border'} ${className}`}
            >
                <Pressable
                    disabled={!onIconPress}
                    onPress={onIconPress}
                    hitSlop={16}
                    className="p-3 pl-4"
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={defaultIconColor} />
                    ) : icon ? (
                        icon
                    ) : (
                        <Search size={22} color={defaultIconColor} />
                    )}
                </Pressable>

                <NativeTextInput
                    ref={ref}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={isDark ? '#9ca3af' : '#94a3b8'}
                    style={[styles.input, inputStyle]}
                    className="flex-1 text-base text-foreground"
                    {...rest}
                />

                {hasValue && (
                    <Pressable
                        onPress={handleClearPress}
                        hitSlop={16}
                        className="p-3 pr-4"
                    >
                        {clearIcon || <X size={20} color={defaultIconColor} />}
                    </Pressable>
                )}
            </Pressable>
        );
    }
);

Searchbar.displayName = 'Searchbar';

const styles = StyleSheet.create({
    container: {
        minHeight: 56,
    },
    input: {
        minHeight: 56,
        paddingVertical: 0,
        textAlignVertical: 'center',
    },
});
