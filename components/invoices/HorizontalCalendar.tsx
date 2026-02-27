import React, { useMemo, useRef, useEffect } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { Text, Badge, ActivityIndicator } from '@/components/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { SCHEME_DARK, SCHEME_LIGHT, ARABIC_MONTHS, ARABIC_DAYS } from '@/utils/constants';



interface HorizontalCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    currentMonthDate: Date;
    onMonthChange: (date: Date) => void;
    invoiceDays: number[];
    loading?: boolean;
    headerRight?: React.ReactNode;
    headerLeft?: React.ReactNode;
}

export function HorizontalCalendar({
    selectedDate,
    onDateChange,
    currentMonthDate,
    onMonthChange,
    invoiceDays,
    headerRight,
    headerLeft,
}: HorizontalCalendarProps) {
    const listRef = useRef<FlatList>(null);
    const { colorScheme } = useColorScheme();
    const scheme = colorScheme === SCHEME_DARK ? SCHEME_DARK : SCHEME_LIGHT;
    const isDark = scheme === SCHEME_DARK;

    const daysInMonth = useMemo(() => {
        const year = currentMonthDate.getFullYear();
        const month = currentMonthDate.getMonth();
        const daysCount = new Date(year, month + 1, 0).getDate();

        return Array.from({ length: daysCount }, (_, i) => {
            const date = new Date(year, month, i + 1);
            return {
                dayNumber: i + 1,
                dayName: ARABIC_DAYS[date.getDay()],
                date,
            };
        });
    }, [currentMonthDate]);

    // Scroll to selected date if it's in the current month
    useEffect(() => {
        if (
            selectedDate.getMonth() === currentMonthDate.getMonth() &&
            selectedDate.getFullYear() === currentMonthDate.getFullYear() &&
            listRef.current
        ) {
            // Give layout a moment to calculate, especially on first render
            setTimeout(() => {
                listRef.current?.scrollToIndex({
                    index: selectedDate.getDate() - 1,
                    animated: true,
                    viewPosition: 0.5, // Center the item
                });
            }, 100);
        }
    }, [selectedDate, currentMonthDate]);

    const handlePrevMonth = () => {
        onMonthChange(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        onMonthChange(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
    };

    const monthName = ARABIC_MONTHS[currentMonthDate.getMonth()];
    const year = currentMonthDate.getFullYear();

    return (
        <View className="w-full mb-4">
            {/* Header Row */}
            <View className="flex-row items-center justify-between px-4 pb-4">
                <View className="flex-row items-center flex-1">
                    <Pressable onPress={handlePrevMonth} className="p-2 ml-[-8px]">
                        <ChevronLeft size={24} color={isDark ? 'white' : 'black'} />
                    </Pressable>
                    <Text variant="titleMedium" className="font-bold mx-2">
                        {monthName} {year}
                    </Text>
                    <Pressable onPress={handleNextMonth} className="p-2">
                        <ChevronRight size={24} color={isDark ? 'white' : 'black'} />
                    </Pressable>
                </View>
                <View className="flex-row items-center gap-2">
                    {headerLeft && <View>{headerLeft}</View>}
                    {headerRight && <View>{headerRight}</View>}
                </View>
            </View>

            {/* Days Strip */}
            <FlatList
                ref={listRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={daysInMonth}
                keyExtractor={(item) => item.dayNumber.toString()}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                onScrollToIndexFailed={(info) => {
                    setTimeout(() => {
                        listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 });
                    }, 500);
                }}
                renderItem={({ item }) => {
                    const isSelected =
                        item.date.getDate() === selectedDate.getDate() &&
                        item.date.getMonth() === selectedDate.getMonth() &&
                        item.date.getFullYear() === selectedDate.getFullYear();

                    const hasInvoices = invoiceDays.includes(item.dayNumber);

                    return (
                        <Pressable
                            onPress={() => onDateChange(item.date)}
                            className={`items-center justify-center w-16 h-20 rounded-2xl border ${isSelected
                                ? 'bg-primary border-primary'
                                : 'bg-surface border-border'
                                }`}
                        >
                            <View className="absolute top-2 w-full items-center">
                                <Badge visible={hasInvoices && !isSelected} className="bg-primary">{''}</Badge>
                                <Badge visible={hasInvoices && isSelected} className="bg-white">{''}</Badge>
                            </View>
                            <Text
                                variant="bodySmall"
                                className={`mb-1 mt-1 ${isSelected ? 'text-primary-on' : 'text-secondary'}`}
                            >
                                {item.dayName}
                            </Text>
                            <Text
                                variant="titleMedium"
                                className={`font-bold ${isSelected ? 'text-primary-on' : ''}`}
                            >
                                {item.dayNumber}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}
