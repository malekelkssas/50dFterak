import React from 'react';
import {
    Text as RNText,
    type TextProps as RNTextProps,
} from 'react-native';

type TextVariant =
    | 'displayLarge'
    | 'displayMedium'
    | 'displaySmall'
    | 'headlineLarge'
    | 'headlineMedium'
    | 'headlineSmall'
    | 'titleLarge'
    | 'titleMedium'
    | 'titleSmall'
    | 'bodyLarge'
    | 'bodyMedium'
    | 'bodySmall'
    | 'labelLarge'
    | 'labelMedium'
    | 'labelSmall';

export interface TextProps extends RNTextProps {
    /** Typography variant following Material Design 3 type scale */
    variant?: TextVariant;
    /** Additional NativeWind className */
    className?: string;
    children: React.ReactNode;
}

/**
 * Material Design 3 type scale mapped to NativeWind classes.
 * Each variant defines fontSize, lineHeight, fontWeight, and letterSpacing.
 */
const variantClasses: Record<TextVariant, string> = {
    // Display
    displayLarge: 'text-[57px] leading-[64px] font-normal tracking-tight',
    displayMedium: 'text-[45px] leading-[52px] font-normal tracking-normal',
    displaySmall: 'text-[36px] leading-[44px] font-normal tracking-normal',

    // Headline
    headlineLarge: 'text-[32px] leading-[40px] font-normal tracking-normal',
    headlineMedium: 'text-[28px] leading-[36px] font-normal tracking-normal',
    headlineSmall: 'text-[24px] leading-[32px] font-normal tracking-normal',

    // Title
    titleLarge: 'text-[22px] leading-[28px] font-normal tracking-normal',
    titleMedium: 'text-[16px] leading-[24px] font-medium tracking-wide',
    titleSmall: 'text-[14px] leading-[20px] font-medium tracking-wide',

    // Body
    bodyLarge: 'text-[16px] leading-[24px] font-normal tracking-wide',
    bodyMedium: 'text-[14px] leading-[20px] font-normal tracking-wide',
    bodySmall: 'text-[12px] leading-[16px] font-normal tracking-wider',

    // Label
    labelLarge: 'text-[14px] leading-[20px] font-medium tracking-wide',
    labelMedium: 'text-[12px] leading-[16px] font-medium tracking-wider',
    labelSmall: 'text-[11px] leading-[16px] font-medium tracking-wider',
};

export function Text({
    variant = 'bodyMedium',
    className = '',
    children,
    ...rest
}: TextProps) {
    return (
        <RNText
            className={`text-foreground ${variantClasses[variant]} ${className}`}
            {...rest}
        >
            {children}
        </RNText>
    );
}
