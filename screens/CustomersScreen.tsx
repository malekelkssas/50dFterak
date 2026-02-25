import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, SegmentedButtons, Searchbar, Button, ActivityIndicator } from '@/components/ui';
import { userService } from '@/backend/services/UserService';
import type { User } from '@/backend/models/User';
import type { AppNavigationProp } from '@/utils/types';
import { SCREENS, CUSTOMERS_STRINGS, CUSTOMER_TABS } from '@/utils/constants';
import { useDebounce } from '@/hooks';
import { Users, ShoppingBag, Plus } from 'lucide-react-native';
import { AddUserModal } from '@/components/users/AddUserModal';

const PAGE_SIZE = 20;

export function CustomersScreen() {
    const navigation = useNavigation<AppNavigationProp<'MainTabs'>>();
    const [activeTab, setActiveTab] = useState<string>(CUSTOMER_TABS.CUSTOMERS);

    // Users State
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [nextCursor, setNextCursor] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // Initial load and search effect
    useEffect(() => {
        if (activeTab === CUSTOMER_TABS.CUSTOMERS) {
            loadInitialUsers();
        }
    }, [debouncedSearch, activeTab]);

    const loadInitialUsers = useCallback(() => {
        setIsLoading(true);
        const { users: newUsers, nextCursor: cursor } = userService.getUsers(
            undefined,
            PAGE_SIZE,
            debouncedSearch
        );
        setUsers(newUsers);
        setNextCursor(cursor);
        setIsLoading(false);
    }, [debouncedSearch]);

    const loadMoreUsers = useCallback(() => {
        if (!nextCursor || isFetchingMore || isLoading) return;

        setIsFetchingMore(true);
        // Add a small delay for smoother UI, or just fetch directly
        setTimeout(() => {
            const { users: newUsers, nextCursor: cursor } = userService.getUsers(
                nextCursor,
                PAGE_SIZE,
                debouncedSearch
            );
            setUsers((prev) => [...prev, ...newUsers]);
            setNextCursor(cursor);
            setIsFetchingMore(false);
        }, 100);
    }, [nextCursor, isFetchingMore, isLoading, debouncedSearch]);

    const handleSaveUser = (data: { name: string; phoneNumber: string; flourAmount: number }) => {
        userService.addUser(data);
        setIsAddModalVisible(false);
        // Refresh the list from scratch to show the newly added user at top
        loadInitialUsers();
    };

    const renderUser = ({ item }: { item: User }) => {
        return (
            <Pressable
                className="bg-surface p-4 rounded-xl mb-3 shadow-md shadow-black/15 elevation-2 border border-border/50 dark:border-white/10"
                onPress={() => navigation.navigate(SCREENS.USER_DETAILS, { userId: item._id.toHexString() })}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text variant="titleMedium" className="font-bold text-foreground mb-1">
                            {item.name || CUSTOMERS_STRINGS.NO_NAME_FALLBACK}
                        </Text>
                        <Text variant="bodyMedium" className="text-muted-foreground">
                            {item.phoneNumber}
                        </Text>
                    </View>
                    <View className="items-end">
                        <Text variant="labelMedium" className="text-muted-foreground mb-1">
                            {CUSTOMERS_STRINGS.BALANCE_LABEL}
                        </Text>
                        <Text variant="titleMedium" className="font-bold text-primary">
                            {item.flourAmount} {CUSTOMERS_STRINGS.KILO_UNIT}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 bg-background">
            {/* Header / Tabs */}
            <View className="p-4 bg-surface border-b border-border shadow-sm z-10">
                <Text variant="headlineMedium" className="mb-4 text-center font-bold">
                    {CUSTOMERS_STRINGS.SCREEN_TITLE}
                </Text>
                <SegmentedButtons
                    value={activeTab}
                    onValueChange={setActiveTab}
                    buttons={[
                        { value: CUSTOMER_TABS.ORDERS, label: CUSTOMERS_STRINGS.TAB_ORDERS, icon: <ShoppingBag size={18} color={activeTab === CUSTOMER_TABS.ORDERS ? '#3b82f6' : '#64748b'} /> },
                        { value: CUSTOMER_TABS.CUSTOMERS, label: CUSTOMERS_STRINGS.TAB_CUSTOMERS, icon: <Users size={18} color={activeTab === CUSTOMER_TABS.CUSTOMERS ? '#3b82f6' : '#64748b'} /> },
                    ]}
                />
            </View>

            {activeTab === CUSTOMER_TABS.ORDERS ? (
                // Orders Empty State
                <View className="flex-1 items-center justify-center p-4">
                    <ShoppingBag size={48} color="#9ca3af" className="mb-4 opacity-50" />
                    <Text variant="titleMedium" className="text-muted-foreground text-center">
                        {CUSTOMERS_STRINGS.ORDERS_EMPTY_STATE}
                    </Text>
                </View>
            ) : (
                // Customers List
                <View className="flex-1">
                    <View className="flex-row items-center p-4 gap-x-3">
                        <View className="flex-1">
                            <Searchbar
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder={CUSTOMERS_STRINGS.SEARCH_PLACEHOLDER}
                                elevation={0}
                                className="bg-muted"
                                loading={searchQuery !== debouncedSearch || (isLoading && !!searchQuery)}
                            />
                        </View>
                        <Button
                            mode="outlined"
                            className="py-2 px-4 shadow-none flex-row items-center gap-2"
                            onPress={() => setIsAddModalVisible(true)}
                        >
                            <Plus size={18} color="#3b82f6" />
                            <Text className="font-bold text-primary">{CUSTOMERS_STRINGS.ADD_BUTTON}</Text>
                        </Button>
                    </View>

                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" />
                        </View>
                    ) : (
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item._id.toHexString()}
                            renderItem={renderUser}
                            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                            onEndReached={loadMoreUsers}
                            onEndReachedThreshold={0.5}
                            ListEmptyComponent={() => (
                                <View className="items-center justify-center py-10">
                                    <Users size={48} color="#9ca3af" className="mb-4 opacity-50" />
                                    <Text variant="bodyLarge" className="text-muted-foreground text-center">
                                        {CUSTOMERS_STRINGS.CUSTOMERS_EMPTY_SEARCH}
                                    </Text>
                                </View>
                            )}
                            ListFooterComponent={() => (
                                isFetchingMore ? (
                                    <View className="py-4 items-center">
                                        <ActivityIndicator size="small" />
                                    </View>
                                ) : null
                            )}
                        />
                    )}
                </View>
            )}

            <AddUserModal
                visible={isAddModalVisible}
                onDismiss={() => setIsAddModalVisible(false)}
                onSave={handleSaveUser}
            />
        </View>
    );
}
