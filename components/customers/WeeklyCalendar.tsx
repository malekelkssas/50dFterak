import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text, Badge } from '@/components/ui';
import { ChevronLeft, ChevronRight, CalendarCheck } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { SCHEME_DARK, SCHEME_LIGHT, ARABIC_MONTHS, ARABIC_DAYS_SAT_START } from '@/utils/constants';



/**
 * Get the Saturday that starts the week containing `date`.
 * In the Arabic locale, weeks typically start on Saturday.
 */
function getWeekStart(date: Date): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = d.getDay(); // 0=Sun..6=Sat
    const diff = dayOfWeek === 6 ? 0 : dayOfWeek + 1; // distance from Saturday
    d.setDate(d.getDate() - diff);
    return d;
}

interface WeeklyCalendarProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    weekStartDate: Date;
    onWeekChange: (newWeekStart: Date) => void;
    orderDays: { day: number; month: number; year: number }[];
}

export function WeeklyCalendar({
    selectedDate,
    onDateChange,
    weekStartDate,
    onWeekChange,
    orderDays,
}: WeeklyCalendarProps) {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === SCHEME_DARK;

    const today = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    const daysInWeek = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(weekStartDate);
            date.setDate(weekStartDate.getDate() + i);
            // Map JS getDay() (0=Sun) to our ARABIC_DAYS_SAT_START array (0=Sat)
            const jsDay = date.getDay(); // 0=Sun..6=Sat
            const arabicIdx = jsDay === 6 ? 0 : jsDay + 1;
            return {
                dayNumber: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                dayName: ARABIC_DAYS_SAT_START[arabicIdx],
                date,
            };
        });
    }, [weekStartDate]);

    const handlePrevWeek = () => {
        const prev = new Date(weekStartDate);
        prev.setDate(prev.getDate() - 7);
        onWeekChange(prev);
    };

    const handleNextWeek = () => {
        const next = new Date(weekStartDate);
        next.setDate(next.getDate() + 7);
        onWeekChange(next);
    };

    const handleBackToToday = () => {
        const todayWeekStart = getWeekStart(today);
        onWeekChange(todayWeekStart);
        onDateChange(today);
    };

    const isCurrentWeek = useMemo(() => {
        const todayWeekStart = getWeekStart(today);
        return (
            weekStartDate.getFullYear() === todayWeekStart.getFullYear() &&
            weekStartDate.getMonth() === todayWeekStart.getMonth() &&
            weekStartDate.getDate() === todayWeekStart.getDate()
        );
    }, [weekStartDate, today]);

    // Build a header label that shows the date range
    const headerLabel = useMemo(() => {
        const first = daysInWeek[0];
        const last = daysInWeek[6];
        if (first.month === last.month && first.year === last.year) {
            return `${first.dayNumber} - ${last.dayNumber} ${ARABIC_MONTHS[first.month - 1]} ${first.year}`;
        }
        if (first.year === last.year) {
            return `${first.dayNumber} ${ARABIC_MONTHS[first.month - 1]} - ${last.dayNumber} ${ARABIC_MONTHS[last.month - 1]} ${first.year}`;
        }
        return `${first.dayNumber} ${ARABIC_MONTHS[first.month - 1]} ${first.year} - ${last.dayNumber} ${ARABIC_MONTHS[last.month - 1]} ${last.year}`;
    }, [daysInWeek]);

    return (
        <View className="w-full mb-2">
            {/* Header Row */}
            <View className="flex-row items-center justify-between px-4 pb-3">
                <View className="flex-row items-center flex-1">
                    <Pressable onPress={handlePrevWeek} className="p-2 ml-[-8px]">
                        <ChevronLeft size={24} color={isDark ? 'white' : 'black'} />
                    </Pressable>
                    <Text variant="titleMedium" className="font-bold mx-2">
                        {headerLabel}
                    </Text>
                    <Pressable onPress={handleNextWeek} className="p-2">
                        <ChevronRight size={24} color={isDark ? 'white' : 'black'} />
                    </Pressable>
                </View>

                {!isCurrentWeek && (
                    <Pressable
                        onPress={handleBackToToday}
                        className="flex-row items-center gap-1 bg-primary/10 border border-primary/30 rounded-lg px-3 py-1.5"
                    >
                        <CalendarCheck size={16} color="#3b82f6" />
                        <Text variant="labelMedium" className="text-primary font-bold">
                            اليوم
                        </Text>
                    </Pressable>
                )}
            </View>

            {/* Days Strip */}
            <View className="flex-row justify-between px-4 gap-2">
                {daysInWeek.map((item) => {
                    const isSelected =
                        item.date.getDate() === selectedDate.getDate() &&
                        item.date.getMonth() === selectedDate.getMonth() &&
                        item.date.getFullYear() === selectedDate.getFullYear();

                    const isToday =
                        item.date.getDate() === today.getDate() &&
                        item.date.getMonth() === today.getMonth() &&
                        item.date.getFullYear() === today.getFullYear();

                    const hasOrders = orderDays.some(
                        (od) => od.day === item.dayNumber && od.month === item.month && od.year === item.year
                    );

                    return (
                        <Pressable
                            key={`${item.year}-${item.month}-${item.dayNumber}`}
                            onPress={() => onDateChange(item.date)}
                            className={`items-center justify-center flex-1 h-20 rounded-2xl border ${isSelected
                                ? 'bg-primary border-primary'
                                : isToday
                                    ? 'bg-surface border-primary/50'
                                    : 'bg-surface border-border'
                                }`}
                        >
                            <View className="absolute top-1.5 w-full items-center">
                                <Badge visible={hasOrders && !isSelected} className="bg-primary">{''}</Badge>
                                <Badge visible={hasOrders && isSelected} className="bg-white">{''}</Badge>
                            </View>
                            <Text
                                variant="bodySmall"
                                className={`mb-0.5 mt-1 ${isSelected ? 'text-primary-on' : 'text-secondary'}`}
                            >
                                {item.dayName}
                            </Text>
                            <Text
                                variant="titleMedium"
                                className={`font-bold ${isSelected ? 'text-primary-on' : isToday ? 'text-primary' : ''}`}
                            >
                                {item.dayNumber}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export { getWeekStart };
