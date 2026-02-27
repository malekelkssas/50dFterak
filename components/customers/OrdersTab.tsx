import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { Text, ActivityIndicator, ToggleButton, Snackbar } from '@/components/ui';
import { WeeklyCalendar, getWeekStart } from '@/components/customers/WeeklyCalendar';
import { orderService } from '@/backend/services/OrderService';
import type { PlainOrder } from '@/backend/realmHelpers';
import { CUSTOMERS_STRINGS } from '@/utils/constants';
import { ShoppingBag } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { OrderCard } from '@/components/customers/OrderCard';

const PAGE_SIZE = 20;

export function OrdersTab() {
    // Calendar State
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [weekStartDate, setWeekStartDate] = useState<Date>(getWeekStart(new Date()));
    const [orderDays, setOrderDays] = useState<{ day: number; month: number; year: number }[]>([]);

    // Orders State — plain JS snapshots, disconnected from Realm
    const [orders, setOrders] = useState<PlainOrder[]>([]);
    const [nextCursor, setNextCursor] = useState<Date | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const isFetchingMoreRef = useRef(false);
    const fetchIdRef = useRef(0);
    const hasMountedRef = useRef(false);

    // Fetch the pending order dots for the current week
    const loadWeekOrderDays = useCallback((date: Date) => {
        try {
            const days = orderService.getOrderDaysInWeek(date);
            setOrderDays(days);
        } catch (error) {
            console.error('Failed to load order days', error);
        }
    }, []);

    // Load orders for the selected date
    const loadInitialOrders = useCallback(() => {
        fetchIdRef.current += 1;
        isFetchingMoreRef.current = false;

        setIsLoadingOrders(true);
        setIsFetchingMore(false);
        try {
            const { orders: fetchedOrders, nextCursor: cursor } = orderService.getOrders(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                selectedDate.getDate(),
                undefined,
                PAGE_SIZE
            );
            setOrders(fetchedOrders);
            setNextCursor(cursor);
        } catch (error) {
            setSnackbarMessage('فشل تحميل الطلبات');
        } finally {
            setIsLoadingOrders(false);
        }
    }, [selectedDate]);

    // Handle initial mount and date changes
    useEffect(() => {
        loadWeekOrderDays(weekStartDate);
    }, [weekStartDate, loadWeekOrderDays]);

    useEffect(() => {
        loadInitialOrders();
    }, [selectedDate, loadInitialOrders]);

    // Refresh when screen gains focus (e.g. returning from UserDetailsScreen)
    useFocusEffect(
        useCallback(() => {
            if (!hasMountedRef.current) {
                hasMountedRef.current = true;
                return;
            }
            // we only want this to run when the screen comes BACK into focus, 
            // not when weekStartDate/selectedDate change while we are already focused.
            // So we deliberately exclude them from the dependency array, but we need
            // to call the fetching functions.
            // To be safe and avoid stale closures, we can just trigger a re-fetch
            // by setting fetchId directly or let the functions run.
            // Since loadWeekOrderDays and loadInitialOrders are wrapped in useCallback
            // with their own dependencies, they might be stale here if we use [] deps.
            // Let's use a ref to track if we just focused.
            loadWeekOrderDays(weekStartDate);
            loadInitialOrders();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [/* deliberately empty to only run on focus */])
    );

    const loadMoreOrders = useCallback(() => {
        if (!nextCursor || isFetchingMoreRef.current || isLoadingOrders) return;

        isFetchingMoreRef.current = true;
        setIsFetchingMore(true);

        const capturedFetchId = fetchIdRef.current;
        try {
            const { orders: fetchedOrders, nextCursor: cursor } = orderService.getOrders(
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
                selectedDate.getDate(),
                nextCursor,
                PAGE_SIZE
            );

            if (capturedFetchId !== fetchIdRef.current) {
                isFetchingMoreRef.current = false;
                setIsFetchingMore(false);
                return;
            }

            setOrders(prev => [...prev, ...fetchedOrders]);
            setNextCursor(cursor);
        } catch (error) {
            setSnackbarMessage('فشل تحميل المزيد من الطلبات');
        } finally {
            isFetchingMoreRef.current = false;
            setIsFetchingMore(false);
        }
    }, [nextCursor, isLoadingOrders, selectedDate]);

    const handleToggleOrder = (orderId: string) => {
        try {
            orderService.toggleDone(orderId);
            // Refresh week dots and re-fetch fresh snapshots
            loadWeekOrderDays(weekStartDate);
            loadInitialOrders();
        } catch (error) {
            setSnackbarMessage('فشل تحديث حالة الطلب');
        }
    };

    const handleDeleteOrder = (orderId: string) => {
        try {
            orderService.deleteOrder(orderId);
            loadWeekOrderDays(weekStartDate);
            loadInitialOrders();
            setSnackbarMessage('تم حذف الطلب بنجاح');
        } catch (error) {
            setSnackbarMessage('فشل حذف الطلب');
        }
    };

    const renderOrderItem = ({ item }: { item: PlainOrder }) => {
        return (
            <OrderCard
                item={item}
                showUserInfo={true}
                onToggleStatus={handleToggleOrder}
                onDelete={handleDeleteOrder}
            />
        );
    };

    return (
        <View className="flex-1 bg-background">
            <View className="pt-4 bg-surface border-b border-border z-10">
                <WeeklyCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    weekStartDate={weekStartDate}
                    onWeekChange={setWeekStartDate}
                    orderDays={orderDays}
                />
            </View>

            {isLoadingOrders ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    onEndReached={loadMoreOrders}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-10">
                            <ShoppingBag size={48} color="#9ca3af" className="mb-4 opacity-50" />
                            <Text variant="bodyLarge" className="text-muted-foreground text-center">
                                {CUSTOMERS_STRINGS.ORDERS_EMPTY_STATE}
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
