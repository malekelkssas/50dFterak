import React from 'react';
import { View, StyleSheet, Pressable, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { Text } from './Text';

export type SegmentedButtonValue = string;

export interface SegmentedButtonItem {
    /**
     * Value of the button
     */
    value: SegmentedButtonValue;
    /**
     * Label of the button
     */
    label?: string;
    /**
     * Custom icon node for the button
     */
    icon?: React.ReactNode;
    /**
     * Additional accessibility label
     */
    accessibilityLabel?: string;
    /**
     * Whether button is disabled
     */
    disabled?: boolean;
    /**
     * Whether to specifically allow to be unchecked if using multiSelect
     */
    checkedIcon?: React.ReactNode;
}

export interface SegmentedButtonsProps {
    /**
     * The array of currently selected values. If `multiSelect` is false, this should contain at most 1 element.
     */
    value: SegmentedButtonValue | SegmentedButtonValue[];
    /**
     * Function to execute on selection change.
     */
    onValueChange: (value: any) => void;
    /**
     * Buttons configuration
     */
    buttons: SegmentedButtonItem[];
    /**
     * Support multiple selections.
     */
    multiSelect?: boolean;
    /**
     * Style for the container
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Additional className for the container
     */
    className?: string;
}

/**
 * Segmented buttons allow users to toggle the selected state of multiple options.
 */
export function SegmentedButtons({
    value,
    onValueChange,
    buttons,
    multiSelect = false,
    style,
    className = '',
}: SegmentedButtonsProps) {
    const isSelected = (btnValue: SegmentedButtonValue) => {
        if (multiSelect && Array.isArray(value)) {
            return value.includes(btnValue);
        }
        return value === btnValue;
    };

    const handlePress = (btnValue: SegmentedButtonValue) => {
        if (multiSelect) {
            const currentValues = Array.isArray(value) ? value : [];
            if (currentValues.includes(btnValue)) {
                onValueChange(currentValues.filter(v => v !== btnValue));
            } else {
                onValueChange([...currentValues, btnValue]);
            }
        } else {
            // If already selecting the same value and not multi-select, paper doesn't unselect
            if (value !== btnValue) {
                onValueChange(btnValue);
            }
        }
    };

    return (
        <View
            style={[styles.container, style]}
            className={`flex-row border border-border rounded-full overflow-hidden ${className}`}
        >
            {buttons.map((button, index) => {
                const selected = isSelected(button.value);
                const isFirst = index === 0;
                const isLast = index === buttons.length - 1;

                return (
                    <Pressable
                        key={button.value}
                        onPress={() => handlePress(button.value)}
                        disabled={button.disabled}
                        accessibilityLabel={button.accessibilityLabel || button.label}
                        accessibilityRole="button"
                        accessibilityState={{ selected, disabled: button.disabled }}
                        style={styles.button}
                        className={`flex-1 flex-row items-center justify-center p-3 
                            ${selected ? 'bg-primary/10' : 'bg-transparent'}
                            ${button.disabled ? 'opacity-50' : ''}
                            ${!isLast ? 'border-r border-border' : ''}
                        `}
                    >
                        {button.icon && (
                            <View className={button.label ? 'mr-2' : ''}>
                                {button.icon}
                            </View>
                        )}
                        {button.label && (
                            <Text
                                style={{
                                    fontWeight: selected ? '600' : 'normal',
                                }}
                                className={`text-base ${selected ? 'text-primary' : 'text-foreground'}`}
                            >
                                {button.label}
                            </Text>
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    button: {
        minHeight: 40,
    },
});
