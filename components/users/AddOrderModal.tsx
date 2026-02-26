import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, TextInput, Button, Text, Portal } from '@/components/ui';
import { CUSTOMERS_STRINGS } from '@/utils/constants';
import { AlertTriangle } from 'lucide-react-native';

interface AddOrderModalProps {
    visible: boolean;
    userFlourBalance: number;
    onDismiss: () => void;
    onSave: (flourAmount: number) => void;
}

export function AddOrderModal({ visible, userFlourBalance, onDismiss, onSave }: AddOrderModalProps) {
    const [flourAmount, setFlourAmount] = useState('');
    const [flourError, setFlourError] = useState('');

    const handleDismiss = () => {
        setFlourAmount('');
        setFlourError('');
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
            onSave(amount);
            setFlourAmount('');
            setFlourError('');
        }
    };

    const parsedAmount = parseFloat(flourAmount.trim()) || 0;
    const exceedsBalance = parsedAmount > 0 && parsedAmount > userFlourBalance;

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

                        {exceedsBalance && (
                            <View className="flex-row items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                                <AlertTriangle size={18} color="#f59e0b" />
                                <Text variant="bodySmall" className="text-amber-600 dark:text-amber-400 flex-1">
                                    {CUSTOMERS_STRINGS.WARNING_EXCEEDS_BALANCE}
                                    {` (${CUSTOMERS_STRINGS.BALANCE_LABEL}: ${userFlourBalance} ${CUSTOMERS_STRINGS.KILO_UNIT})`}
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
