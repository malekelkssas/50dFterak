import React from 'react';
import { View, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { Text } from './Text';

export interface BadgeProps {
    /**
     * Whether the badge is visible.
     */
    visible?: boolean;
    /**
     * Content of the `Badge`.
     */
    children?: string | number;
    /**
     * Size of the `Badge`.
     */
    size?: number;
    /**
     * Style for the badge wrapper.
     */
    style?: StyleProp<ViewStyle>;
    /**
     * Style for the badge text.
     */
    textStyle?: StyleProp<TextStyle>;
    /**
     * Additional className for the wrapper container.
     */
    className?: string;
    /**
     * Additional className for the text container.
     */
    textClassName?: string;
}

/**
 * Badges are used to highlight an item's status for quick recognition.
 */
export function Badge({
    visible = true,
    children,
    size,
    style,
    textStyle,
    className = '',
    textClassName = '',
}: BadgeProps) {
    if (!visible) return null;

    const isDot = children === undefined || children === null || children === '';

    // Default sizes based on whether it's a dot or has content
    const defaultSize = isDot ? 8 : 20;
    const badgeSize = size ?? defaultSize;

    return (
        <View
            style={[
                {
                    height: badgeSize,
                    minWidth: badgeSize,
                    borderRadius: badgeSize / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: isDot ? 0 : badgeSize * 0.25,
                },
                style,
            ]}
            className={`bg-primary ${className}`}
        >
            {!isDot && (
                <Text
                    style={[
                        {
                            color: 'white',
                            fontSize: badgeSize * 0.55,
                            lineHeight: badgeSize * 0.7,
                            fontWeight: '600',
                            textAlign: 'center',
                        },
                        textStyle,
                    ]}
                    className={textClassName}
                >
                    {children}
                </Text>
            )}
        </View>
    );
}
