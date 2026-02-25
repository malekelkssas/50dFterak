import React from 'react';
import { View } from 'react-native';
import { vars, useColorScheme } from 'nativewind';

const lightTheme = vars({
    '--color-background': '255 255 255',
    '--color-foreground': '10 10 10',
    '--color-primary': '59 130 246',
    '--color-secondary': '100 116 139',
    '--color-muted': '241 245 249',
    '--color-accent': '99 102 241',
});

const darkTheme = vars({
    '--color-background': '10 10 10',
    '--color-foreground': '245 245 245',
    '--color-primary': '96 165 250',
    '--color-secondary': '148 163 184',
    '--color-muted': '30 41 59',
    '--color-accent': '129 140 248',
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const { colorScheme } = useColorScheme();
    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <View style={theme} className="flex-1">
            {children}
        </View>
    );
}
