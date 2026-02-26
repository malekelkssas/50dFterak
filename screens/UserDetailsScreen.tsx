import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, Pencil, Trash2, Plus, Clock, Check, UserCircle } from 'lucide-react-native';
import { BSON } from 'realm';

import {
    Text,
    Button,
    ActivityIndicator,
    Dialog,
    Portal,
    ToggleButton,
    Snackbar
} from '@/components/ui';
import { EditUserModal } from '@/components/users/EditUserModal';
import { AddOrderModal } from '@/components/users/AddOrderModal';

import { userService } from '@/backend/services/UserService';
import { orderService } from '@/backend/services/OrderService';
import type { User } from '@/backend/models/User';
import type { Order } from '@/backend/models/Order';

import type { AppNavigationProp, AppRouteProp } from '@/utils/types';
import { SCHEME_DARK, CUSTOMERS_STRINGS } from '@/utils/constants';

const PAGE_SIZE = 20;

export function UserDetailsScreen() {
    const navigation = useNavigation<AppNavigationProp<'UserDetails'>>();
    const route = useRoute<AppRouteProp<'UserDetails'>>();
    const { userId } = route.params;

    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === SCHEME_DARK;
    const iconColor = isDark ? '#ffffff' : '#000000';

    // State
    const [user, setUser] = useState<User | null>(null);
    const [pendingFlour, setPendingFlour] = useState(0);
    const [orders, setOrders] = useState<Order[]>([]);

    // Pagination
    const [nextCursor, setNextCursor] = useState<Date | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Modals & Dialogs
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [isAddOrderModalVisible, setIsAddOrderModalVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const loadUserData = useCallback(() => {
        try {
            const userObj = userService.getUserById(userId);
            if (userObj) {
                setUser(userObj);
                const pending = orderService.getPendingFlourAmountByUser(userId);
                setPendingFlour(pending);
            } else {
                setSnackbarMessage('الزبون غير موجود');
            }
        } catch (error) {
            setSnackbarMessage('فشل تحميل بيانات الزبون');
        }
    }, [userId]);

    const loadInitialOrders = useCallback(() => {
        setIsLoadingOrders(true);
        try {
            const { orders: fetchedOrders, nextCursor: cursor } = orderService.getOrdersByUser(userId, undefined, PAGE_SIZE);
            setOrders(fetchedOrders);
            setNextCursor(cursor);
        } catch (error) {
            setSnackbarMessage('فشل تحميل الطلبات');
        } finally {
            setIsLoadingOrders(false);
        }
    }, [userId]);

    const loadMoreOrders = useCallback(() => {
        if (!nextCursor || isFetchingMore || isLoadingOrders) return;

        setIsFetchingMore(true);
        setTimeout(() => {
            try {
                const { orders: fetchedOrders, nextCursor: cursor } = orderService.getOrdersByUser(userId, nextCursor, PAGE_SIZE);
                setOrders(prev => [...prev, ...fetchedOrders]);
                setNextCursor(cursor);
            } catch (error) {
                setSnackbarMessage('فشل تحميل المزيد من الطلبات');
            } finally {
                setIsFetchingMore(false);
            }
        }, 100);
    }, [userId, nextCursor, isFetchingMore, isLoadingOrders]);

    useEffect(() => {
        loadUserData();
        loadInitialOrders();
    }, [loadUserData, loadInitialOrders]);

    const handleSaveEdit = (data: { name?: string; phoneNumber?: string; flourAmount?: number }) => {
        userService.updateUser(userId, data);
        setIsEditModalVisible(false);
        loadUserData();
    };

    const handleDeleteUser = () => {
        setIsDeleteDialogVisible(false);
        // Null out user state immediately to prevent accessing invalidated Realm object
        setUser(null);
        // Navigate away first to avoid the screen re-rendering with stale data
        navigation.goBack();
        // Then delete from Realm
        userService.deleteUser(userId);
    };

    const handleToggleOrder = (orderId: string) => {
        orderService.toggleDone(orderId);
        // Refresh pending flour amount
        loadUserData();
        // Since the realm object updates in memory, we can just trigger a re-render
        // For flatlist to catch it securely, we can spread the list or let Realm auto-update handle it.
        // We will spread to force UI update on the toggle button safely.
        setOrders([...orders]);
    };

    const handleAddOrder = (flourAmount: number) => {
        if (!user) return;
        const now = new Date();
        orderService.addOrder({
            day: now.getDate(),
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            flourAmount,
            user,
        });
        setIsAddOrderModalVisible(false);
        loadUserData();
        loadInitialOrders();
    };

    const renderOrderItem = ({ item }: { item: Order }) => {
        const isDone = !!item.doneAt;

        return (
            <View className="bg-surface p-4 rounded-xl mb-3 border border-border flex-row items-center justify-between shadow-sm">
                <View className="flex-1">
                    <Text variant="titleMedium" className="font-bold mb-1">
                        {item.flourAmount} {CUSTOMERS_STRINGS.KILO_UNIT}
                    </Text>
                    <Text variant="bodySmall" className="text-muted-foreground">
                        {item.createdAt.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </Text>
                    {isDone && item.doneAt && (
                        <Text variant="bodySmall" className="text-emerald-500 mt-0.5">
                            ✓ {item.doneAt.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </Text>
                    )}
                </View>

                <ToggleButton
                    value={item._id.toHexString()}
                    status={isDone ? 'checked' : 'unchecked'}
                    onPress={() => handleToggleOrder(item._id.toHexString())}
                    icon={isDone ? <Check size={20} color="#10b981" /> : <Clock size={20} color="#f59e0b" />}
                    className={`border ${isDone ? 'border-emerald-500/30' : 'border-amber-500/30'}`}
                />
            </View>
        );
    };

    if (!user || !user.isValid()) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header Nav */}
            <View className="flex-row items-center p-4 border-b border-border bg-surface z-10">
                <Pressable onPress={() => navigation.goBack()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color={iconColor} />
                </Pressable>
                <Text variant="titleLarge" className="ml-4 flex-1">
                    تفاصيل الزبون
                </Text>
            </View>

            {/* Top Half: User Info */}
            <View className="p-4 bg-surface border-b border-border shadow-sm mb-4">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                        <UserCircle size={48} color="#9ca3af" />
                        <View className="ml-3 flex-1">
                            <Text variant="headlineSmall" className="font-bold text-foreground">
                                {user.name}
                            </Text>
                            <Text variant="bodyMedium" className="text-muted-foreground">
                                {user.phoneNumber}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row gap-2">
                        <Button mode="outlined" className="px-3" onPress={() => setIsEditModalVisible(true)}>
                            <Pencil size={18} color="#3b82f6" />
                        </Button>
                        <Button mode="outlined" className="px-3 border-destructive" onPress={() => setIsDeleteDialogVisible(true)}>
                            <Trash2 size={18} color="#ef4444" />
                        </Button>
                    </View>
                </View>

                <View className="flex-row justify-between bg-muted rounded-xl p-4 border border-border">
                    <View className="items-center flex-1 border-r border-border">
                        <Text variant="labelMedium" className="text-muted-foreground mb-1">
                            {CUSTOMERS_STRINGS.BALANCE_LABEL}
                        </Text>
                        <Text variant="titleLarge" className={`font-bold ${user.flourAmount < 0 ? 'text-red-500' : 'text-foreground'}`}>
                            {user.flourAmount} {CUSTOMERS_STRINGS.KILO_UNIT}
                        </Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text variant="labelMedium" className="text-muted-foreground mb-1">
                            {CUSTOMERS_STRINGS.PENDING_FLOUR_LABEL}
                        </Text>
                        <Text variant="titleLarge" className="font-bold text-amber-500">
                            {pendingFlour} {CUSTOMERS_STRINGS.KILO_UNIT}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom Half: Orders List */}
            <View className="flex-1 px-4">
                <View className="flex-row items-center justify-between mb-3">
                    <Text variant="titleLarge" className="font-bold text-foreground">
                        الطلبات
                    </Text>
                    <Button
                        mode="contained"
                        className="flex-row items-center gap-2 py-1.5 px-3"
                        onPress={() => setIsAddOrderModalVisible(true)}
                    >
                        <Plus size={16} color="#ffffff" />
                        <Text className="text-white font-bold ml-1">{CUSTOMERS_STRINGS.CREATE_ORDER_BTN}</Text>
                    </Button>
                </View>

                {isLoadingOrders ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator />
                    </View>
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item._id.toHexString()}
                        renderItem={renderOrderItem}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        onEndReached={loadMoreOrders}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={() => (
                            <View className="items-center justify-center py-10 mt-10">
                                <Clock size={48} color="#9ca3af" className="mb-4 opacity-50" />
                                <Text variant="bodyLarge" className="text-muted-foreground text-center">
                                    لا يوجد طلبات سابقة.
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

            {/* Edit Modal */}
            <EditUserModal
                visible={isEditModalVisible}
                initialData={{ name: user.name, phoneNumber: user.phoneNumber, flourAmount: user.flourAmount }}
                onDismiss={() => setIsEditModalVisible(false)}
                onSave={handleSaveEdit}
            />

            {/* Add Order Modal */}
            <AddOrderModal
                visible={isAddOrderModalVisible}
                userFlourBalance={user.flourAmount}
                onDismiss={() => setIsAddOrderModalVisible(false)}
                onSave={handleAddOrder}
            />

            {/* Delete Confirmation Dialog */}
            <Portal>
                <Dialog visible={isDeleteDialogVisible} onDismiss={() => setIsDeleteDialogVisible(false)}>
                    <Dialog.Title>{CUSTOMERS_STRINGS.DELETE_WARNING_TITLE}</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">{CUSTOMERS_STRINGS.DELETE_WARNING_TEXT}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button mode="text" onPress={() => setIsDeleteDialogVisible(false)}>
                            {CUSTOMERS_STRINGS.BTN_CANCEL}
                        </Button>
                        <Button mode="contained" className="bg-destructive" onPress={handleDeleteUser}>
                            {CUSTOMERS_STRINGS.BTN_DELETE}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Error Snackbar */}
            <Snackbar
                visible={!!snackbarMessage}
                onDismiss={() => setSnackbarMessage('')}
                duration={3000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}
