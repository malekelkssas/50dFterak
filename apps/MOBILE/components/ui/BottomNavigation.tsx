import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'nativewind';
import { ThemeToggle } from '@mobile/components/ThemeToggle';
import { Home, ReceiptText, Users } from 'lucide-react-native';
import { SCREENS } from '@mobile/utils/constants';
import {
  colors,
  SCHEME_DARK,
  SCHEME_LIGHT,
} from '@mobile/utils/constants/theme';

/** Convert space-separated RGB channels (e.g. '59 130 246') to an rgb() string */
const rgb = (channels: string) => `rgb(${channels.replace(/ /g, ', ')})`;

export function BottomNavigation({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === SCHEME_DARK ? SCHEME_DARK : SCHEME_LIGHT;
  const primaryColor = rgb(colors[scheme].primary);
  const secondaryColor = rgb(colors[scheme].secondary);

  return (
    <View className="bg-surface border-border elevation-8 h-20 flex-row items-center border-t px-2 pt-2 pb-4 shadow-sm">
      {/* Theme Toggle - Far Left */}
      <View className="mr-1 flex-[1.5] items-center justify-center">
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
          <View
            key={route.key}
            className="h-full flex-1 items-center justify-center"
          >
            <View
              className={`mb-1 overflow-hidden rounded-full ${isFocused ? 'bg-primary/15' : 'bg-transparent'}`}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                android_ripple={{
                  color:
                    scheme === SCHEME_DARK
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.15)',
                  borderless: false,
                }}
                className="items-center justify-center px-5 py-2"
              >
                <IconComponent
                  size={20}
                  strokeWidth={isFocused ? 2.5 : 2}
                  color={isFocused ? primaryColor : secondaryColor}
                />
              </Pressable>
            </View>
            <Text
              className={`pt-0.5 text-[10px] font-medium ${isFocused ? 'text-primary font-bold' : 'text-secondary'}`}
              numberOfLines={1}
              onPress={onPress}
            >
              {label as string}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
