import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, Pencil, Trash2, Plus, Clock, Check, UserCircle } from 'lucide-react-native';

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
import { OrderCard } from '@/components/customers/OrderCard';

import { userService } from '@/backend/services/UserService';
import { orderService } from '@/backend/services/OrderService';
import type { PlainUser, PlainOrder } from '@/backend/realmHelpers';

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

    // State — plain JS snapshots, disconnected from Realm
    const [user, setUser] = useState<PlainUser | null>(null);
    const [pendingFlour, setPendingFlour] = useState(0);
    const [orders, setOrders] = useState<PlainOrder[]>([]);

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
        setUser(null);
        userService.deleteUser(userId);
        navigation.goBack();
    };

    const handleToggleOrder = (orderId: string) => {
        orderService.toggleDone(orderId);
        // Re-fetch fresh snapshots
        loadUserData();
        loadInitialOrders();
    };

    const handleAddOrder = (flourAmount: number, orderDate: Date) => {
        if (!user) return;
        orderService.addOrder({
            day: orderDate.getDate(),
            month: orderDate.getMonth() + 1,
            year: orderDate.getFullYear(),
            flourAmount,
            userId,
        });
        setIsAddOrderModalVisible(false);
        loadUserData();
        loadInitialOrders();
    };

    const handleDeleteOrder = (orderId: string) => {
        orderService.deleteOrder(orderId);
        loadUserData();
        loadInitialOrders();
    };

    const renderOrderItem = ({ item }: { item: PlainOrder }) => {
        return (
            <OrderCard
                item={item}
                showUserInfo={false}
                onToggleStatus={handleToggleOrder}
                onDelete={handleDeleteOrder}
            />
        );
    };

    if (!user) {
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
                        keyExtractor={(item) => item._id}
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
