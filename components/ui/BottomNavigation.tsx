import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'nativewind';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Home, ReceiptText, Users } from 'lucide-react-native';
import { SCREENS } from '@/utils/constants';
import { colors, SCHEME_DARK, SCHEME_LIGHT } from '@/utils/constants/theme';

/** Convert space-separated RGB channels (e.g. '59 130 246') to an rgb() string */
const rgb = (channels: string) => `rgb(${channels.replace(/ /g, ', ')})`;

export function BottomNavigation({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colorScheme } = useColorScheme();
    const scheme = colorScheme === SCHEME_DARK ? SCHEME_DARK : SCHEME_LIGHT;
    const primaryColor = rgb(colors[scheme].primary);
    const secondaryColor = rgb(colors[scheme].secondary);

    return (
        <View className="flex-row items-center bg-surface h-20 px-2 pb-4 pt-2 border-t border-border elevation-8 shadow-sm">
            {/* Theme Toggle - Far Left */}
            <View className="flex-[1.5] items-center justify-center mr-1">
                <ThemeToggle />
            </View>

            {/* Navigation Tabs */}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                let IconComponent = Home;
                if (route.name === SCREENS.HOME) IconComponent = Home;
                else if (route.name === SCREENS.INVOICES) IconComponent = ReceiptText;
                else if (route.name === SCREENS.CUSTOMERS) IconComponent = Users;

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        className="flex-1 items-center justify-center h-full"
                    >
                        <View className={`px-5 py-2 rounded-full mb-1 ${isFocused ? 'bg-primary/15' : 'bg-transparent'}`}>
                            <IconComponent
                                size={20}
                                strokeWidth={isFocused ? 2.5 : 2}
                                color={isFocused ? primaryColor : secondaryColor}
                            />
                        </View>
                        <Text
                            className={`text-[10px] font-medium ${isFocused ? 'text-primary font-bold' : 'text-secondary'}`}
                            numberOfLines={1}
                        >
                            {label as string}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
