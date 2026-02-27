import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, Searchbar, Button, ActivityIndicator } from '@/components/ui';
import { userService } from '@/backend/services/UserService';
import type { PlainUser } from '@/backend/realmHelpers';
import type { AppNavigationProp } from '@/utils/types';
import { SCREENS, CUSTOMERS_STRINGS } from '@/utils/constants';
import { useDebounce } from '@/hooks';
import { Users, Plus } from 'lucide-react-native';
import { AddUserModal } from '@/components/users/AddUserModal';

const PAGE_SIZE = 20;

export function CustomersTab() {
    const navigation = useNavigation<AppNavigationProp<'MainTabs'>>();

    // Users State — plain JS snapshots, disconnected from Realm
    const [users, setUsers] = useState<PlainUser[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [nextCursor, setNextCursor] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // Ref-based guards to avoid stale closure issues
    const isFetchingMoreRef = useRef(false);
    const fetchIdRef = useRef(0);
    const hasMountedRef = useRef(false);

    const latestStateRef = useRef({ loadInitialUsers: () => { } });

    const loadInitialUsers = useCallback(() => {
        // Increment fetchId so any in-flight loadMoreUsers knows it's stale
        fetchIdRef.current += 1;
        isFetchingMoreRef.current = false;

        setIsLoading(true);
        setIsFetchingMore(false);
        const { users: newUsers, nextCursor: cursor } = userService.getUsers(
            undefined,
            PAGE_SIZE,
            debouncedSearch
        );
        setUsers(newUsers);
        setNextCursor(cursor);
        setIsLoading(false);
    }, [debouncedSearch]);

    // Initial load and search changes
    useEffect(() => {
        loadInitialUsers();
    }, [debouncedSearch, loadInitialUsers]);

    useEffect(() => {
        latestStateRef.current = { loadInitialUsers };
    }, [loadInitialUsers]);

    // Refresh data only when screen regains focus (not on initial mount)
    useFocusEffect(
        useCallback(() => {
            if (!hasMountedRef.current) {
                hasMountedRef.current = true;
                return;
            }
            latestStateRef.current.loadInitialUsers();
        }, [])
    );

    const loadMoreUsers = useCallback(() => {
        if (!nextCursor || isFetchingMoreRef.current || isLoading) return;

        isFetchingMoreRef.current = true;
        setIsFetchingMore(true);

        const capturedFetchId = fetchIdRef.current;
        const { users: newUsers, nextCursor: cursor } = userService.getUsers(
            nextCursor,
            PAGE_SIZE,
            debouncedSearch
        );

        // Bail out if a new initial load was triggered while we were fetching
        if (capturedFetchId !== fetchIdRef.current) {
            isFetchingMoreRef.current = false;
            setIsFetchingMore(false);
            return;
        }

        setUsers((prev) => [...prev, ...newUsers]);
        setNextCursor(cursor);
        isFetchingMoreRef.current = false;
        setIsFetchingMore(false);
    }, [nextCursor, isLoading, debouncedSearch]);

    const handleSaveUser = (data: { name: string; phoneNumber: string; flourAmount: number }) => {
        userService.addUser(data);
        setIsAddModalVisible(false);
        // Refresh the list from scratch to show the newly added user at top
        loadInitialUsers();
    };

    const renderUser = ({ item }: { item: PlainUser }) => {
        return (
            <Pressable
                className="bg-surface p-4 rounded-xl mb-3 shadow-md shadow-black/15 elevation-2 border border-border/50 dark:border-white/10"
                onPress={() => navigation.navigate(SCREENS.USER_DETAILS, { userId: item._id })}
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
                    keyExtractor={(item) => item._id}
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

            <AddUserModal
                visible={isAddModalVisible}
                onDismiss={() => setIsAddModalVisible(false)}
                onSave={handleSaveUser}
            />
        </View>
    );
}
