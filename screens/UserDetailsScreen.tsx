import React from 'react';
import { View, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Text } from '@/components/ui';
import { ChevronLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import type { AppNavigationProp, AppRouteProp } from '@/utils/types';
import { SCHEME_DARK } from '@/utils/constants';

export function UserDetailsScreen() {
    const navigation = useNavigation<AppNavigationProp<'UserDetails'>>();
    const route = useRoute<AppRouteProp<'UserDetails'>>();
    const { userId } = route.params;

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === SCHEME_DARK;
    const iconColor = isDark ? '#ffffff' : '#000000';

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-border">
                {/* Back Button - RTL means chevron right points back in Arabic */}
                <Pressable
                    onPress={() => navigation.goBack()}
                    className="p-2 -ml-2"
                >
                    <ChevronLeft size={24} color={iconColor} />
                </Pressable>

                <Text variant="titleLarge" className="ml-4 flex-1">
                    تفاصيل الزبون
                </Text>
            </View>

            {/* Body */}
            <View className="flex-1 items-center justify-center p-4">
                <Text variant="bodyLarge">User ID: {userId}</Text>
                <Text variant="bodyMedium" className="mt-2 text-muted-foreground">
                    This screen is currently empty
                </Text>
            </View>
        </View>
    );
}
