import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, View, Text } from 'react-native';
import { useColorScheme } from 'nativewind';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const translateX = useRef(new Animated.Value(isDark ? 26 : 0)).current;
  const rotation = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isDark ? 26 : 0,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.timing(rotation, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark, translateX, rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="flex-row items-center gap-3"
      accessibilityRole="switch"
      accessibilityState={{ checked: isDark }}
      accessibilityLabel="Toggle dark mode"
    >
      {/* Track */}
      <View
        className={`h-[30px] w-[56px] justify-center rounded-full px-[2px] ${
          isDark ? 'bg-accent' : 'bg-secondary/30'
        }`}
      >
        {/* Thumb */}
        <Animated.View
          style={{
            transform: [{ translateX }, { rotate: spin }],
          }}
          className={`h-[26px] w-[26px] items-center justify-center rounded-full ${
            isDark ? 'bg-foreground' : 'bg-white'
          }`}
        >
          <Text style={{ fontSize: 14 }}>{isDark ? '🌙' : '☀️'}</Text>
        </Animated.View>
      </View>

      {/* Label */}
      <Text className="text-foreground text-sm font-medium">
        {isDark ? 'Dark' : 'Light'}
      </Text>
    </Pressable>
  );
}
