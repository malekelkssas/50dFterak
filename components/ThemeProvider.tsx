import React from 'react';
import { View } from 'react-native';
import { vars, useColorScheme } from 'nativewind';
import { colors, SCHEME_DARK } from '@/utils/constants';

const lightTheme = vars({
    '--color-background': colors.light.background,
    '--color-foreground': colors.light.foreground,
    '--color-primary': colors.light.primary,
    '--color-secondary': colors.light.secondary,
    '--color-muted': colors.light.muted,
    '--color-accent': colors.light.accent,
});

const darkTheme = vars({
    '--color-background': colors.dark.background,
    '--color-foreground': colors.dark.foreground,
    '--color-primary': colors.dark.primary,
    '--color-secondary': colors.dark.secondary,
    '--color-muted': colors.dark.muted,
    '--color-accent': colors.dark.accent,
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { colorScheme } = useColorScheme();
    const theme = colorScheme === SCHEME_DARK ? darkTheme : lightTheme;

    return (
        <View style={theme} className="flex-1">
            {children}
        </View>
    );
}
