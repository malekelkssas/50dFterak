import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Dialog, TextInput, Button, Text, Portal } from '@/components/ui';
import { CUSTOMERS_STRINGS } from '@/utils/constants';
import { AlertTriangle, Calendar as CalendarIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddOrderModalProps {
    visible: boolean;
    userFlourBalance: number;
    pendingFlour: number;
    onDismiss: () => void;
    onSave: (flourAmount: number, date: Date) => void;
}

export function AddOrderModal({ visible, userFlourBalance, pendingFlour, onDismiss, onSave }: AddOrderModalProps) {
    const [flourAmount, setFlourAmount] = useState('');
    const [flourError, setFlourError] = useState('');

    // Date State
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDismiss = () => {
        setFlourAmount('');
        setFlourError('');
        setDate(new Date());
        setShowDatePicker(false);
        onDismiss();
    };

    const validate = (): boolean => {
        const num = parseFloat(flourAmount.trim());
        if (isNaN(num) || num <= 0) {
            setFlourError(CUSTOMERS_STRINGS.ERR_ORDER_FLOUR_INVALID);
            return false;
        }
        setFlourError('');
        return true;
    };

    const handleSave = () => {
        if (validate()) {
            const amount = parseFloat(flourAmount.trim());
            onSave(amount, date);

            // Reset for next time
            setFlourAmount('');
            setFlourError('');
            setDate(new Date());
        }
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const parsedAmount = parseFloat(flourAmount.trim()) || 0;
    const availableBalance = userFlourBalance - pendingFlour;
    const exceedsBalance = parsedAmount > 0 && parsedAmount > availableBalance;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleDismiss} dismissable={false}>
                <Dialog.Title>{CUSTOMERS_STRINGS.MODAL_ADD_ORDER_TITLE}</Dialog.Title>
                <Dialog.Content>
                    <View className="gap-y-4 pt-2">
                        <TextInput
                            label={CUSTOMERS_STRINGS.LABEL_ORDER_FLOUR}
                            value={flourAmount}
                            onChangeText={(text) => {
                                setFlourAmount(text);
                                if (flourError) setFlourError('');
                            }}
                            keyboardType="numeric"
                            error={!!flourError}
                            errorText={flourError}
                        />

                        {/* Date Picker Button */}
                        <View>
                            <Text variant="labelMedium" className="text-muted-foreground mb-1">
                                {CUSTOMERS_STRINGS.LABEL_ORDER_DATE}
                            </Text>
                            <Pressable
                                onPress={() => setShowDatePicker(true)}
                                className="flex-row items-center justify-between border border-border/70 rounded-md px-3 h-12 bg-surface"
                            >
                                <Text variant="bodyLarge" className="text-foreground">
                                    {date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </Text>
                                <CalendarIcon size={20} color="#64748b" />
                            </Pressable>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}

                        {exceedsBalance && (
                            <View className="flex-row items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                <AlertTriangle size={18} color="#f59e0b" />
                                <Text variant="bodySmall" className="text-amber-600 dark:text-amber-400 flex-1">
                                    {CUSTOMERS_STRINGS.WARNING_EXCEEDS_BALANCE}
                                    {` (${CUSTOMERS_STRINGS.AVAILABLE_BALANCE_LABEL}: ${availableBalance} ${CUSTOMERS_STRINGS.KILO_UNIT})`}
                                </Text>
                            </View>
                        )}
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button mode="text" onPress={handleDismiss}>
                        {CUSTOMERS_STRINGS.BTN_CANCEL}
                    </Button>
                    <Button mode="contained" onPress={handleSave}>
                        {CUSTOMERS_STRINGS.BTN_SAVE}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
