import React from 'react';
import {
    View,
    Pressable,
    Image,
    type PressableProps,
    type ImageSourcePropType,
    type StyleProp,
    type ViewStyle,
    type ImageStyle,
} from 'react-native';
import { Text } from './Text';

// ── Card Modes ──────────────────────────────────────────────────────────

export type CardMode = 'elevated' | 'outlined' | 'contained';

export interface CardProps extends Omit<PressableProps, 'children'> {
    /** Card mode. Default: 'elevated' */
    mode?: CardMode;
    /** Card content */
    children: React.ReactNode;
    /** Additional NativeWind className */
    className?: string;
    /** Style override */
    style?: StyleProp<ViewStyle>;
    /** Whether the card is disabled */
    disabled?: boolean;
}

const modeClasses: Record<CardMode, string> = {
    elevated: 'bg-muted rounded-xl shadow-md shadow-black/15 elevation-2',
    outlined: 'bg-muted rounded-xl border border-secondary/30',
    contained: 'bg-muted rounded-xl',
};

// ── Card Component ──────────────────────────────────────────────────────

function CardRoot({
    mode = 'elevated',
    children,
    className = '',
    style,
    disabled = false,
    onPress,
    ...pressableProps
}: CardProps) {
    const content = (
        <View className={`overflow-hidden ${modeClasses[mode]} ${className}`} style={style}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <Pressable
                {...pressableProps}
                onPress={onPress}
                disabled={disabled}
                style={({ pressed }) => [pressed ? { opacity: 0.85 } : {}]}
                accessibilityRole="button"
            >
                {content}
            </Pressable>
        );
    }

    return content;
}

// ── Card.Title ──────────────────────────────────────────────────────────

export interface CardTitleProps {
    /** Title text */
    title: string;
    /** Subtitle text */
    subtitle?: string;
    /** Element rendered on the left side (e.g. avatar) */
    left?: (props: { size: number }) => React.ReactNode;
    /** Element rendered on the right side */
    right?: (props: { size: number }) => React.ReactNode;
    /** Additional NativeWind className */
    className?: string;
}

function CardTitle({ title, subtitle, left, right, className = '' }: CardTitleProps) {
    return (
        <View className={`flex-row items-center px-4 py-3 ${className}`}>
            {left && <View className="mr-3">{left({ size: 40 })}</View>}
            <View className="flex-1">
                <Text variant="titleMedium">{title}</Text>
                {subtitle && (
                    <Text variant="bodySmall" className="text-secondary mt-0.5">
                        {subtitle}
                    </Text>
                )}
            </View>
            {right && <View className="ml-3">{right({ size: 24 })}</View>}
        </View>
    );
}

// ── Card.Content ────────────────────────────────────────────────────────

export interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

function CardContent({ children, className = '' }: CardContentProps) {
    return <View className={`px-4 py-2 ${className}`}>{children}</View>;
}

// ── Card.Cover ──────────────────────────────────────────────────────────

export interface CardCoverProps {
    /** Image source */
    source: ImageSourcePropType;
    /** Additional NativeWind className */
    className?: string;
    /** Style override for the image */
    style?: StyleProp<ImageStyle>;
}

function CardCover({ source, className = '', style }: CardCoverProps) {
    return (
        <View className={`overflow-hidden ${className}`}>
            <Image
                source={source}
                className="w-full h-[200px]"
                style={style}
                resizeMode="cover"
            />
        </View>
    );
}

// ── Card.Actions ────────────────────────────────────────────────────────

export interface CardActionsProps {
    children: React.ReactNode;
    className?: string;
}

function CardActions({ children, className = '' }: CardActionsProps) {
    return (
        <View className={`flex-row justify-end items-center px-2 py-2 gap-2 ${className}`}>
            {children}
        </View>
    );
}

// ── Compose ─────────────────────────────────────────────────────────────

export const Card = Object.assign(CardRoot, {
    Title: CardTitle,
    Content: CardContent,
    Cover: CardCover,
    Actions: CardActions,
});
