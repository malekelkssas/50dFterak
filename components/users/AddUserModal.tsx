import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, TextInput, Button, Portal } from '@/components/ui';
import { CUSTOMERS_STRINGS } from '@/utils/constants';

interface AddUserModalProps {
    visible: boolean;
    onDismiss: () => void;
    onSave: (data: { name: string; phoneNumber: string; flourAmount: number }) => void;
}

export function AddUserModal({ visible, onDismiss, onSave }: AddUserModalProps) {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [flourAmount, setFlourAmount] = useState('0');

    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [flourError, setFlourError] = useState('');

    const resetForm = () => {
        setName('');
        setPhoneNumber('');
        setFlourAmount('0');
        setNameError('');
        setPhoneError('');
        setFlourError('');
    };

    const handleDismiss = () => {
        resetForm();
        onDismiss();
    };

    const validate = (): boolean => {
        let isValid = true;

        if (!name.trim()) {
            setNameError(CUSTOMERS_STRINGS.ERR_NAME_REQUIRED);
            isValid = false;
        } else {
            setNameError('');
        }

        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phoneNumber.trim())) {
            setPhoneError(CUSTOMERS_STRINGS.ERR_PHONE_INVALID);
            isValid = false;
        } else {
            setPhoneError('');
        }

        const flourNum = parseFloat(flourAmount.trim());
        if (isNaN(flourNum) || flourNum < 0) {
            setFlourError(CUSTOMERS_STRINGS.ERR_FLOUR_INVALID);
            isValid = false;
        } else {
            setFlourError('');
        }

        return isValid;
    };

    const handleSave = () => {
        if (validate()) {
            onSave({
                name: name.trim(),
                phoneNumber: phoneNumber.trim(),
                flourAmount: parseFloat(flourAmount.trim()) || 0,
            });
            resetForm();
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={handleDismiss} dismissable={false}>
                <Dialog.Title>{CUSTOMERS_STRINGS.MODAL_ADD_TITLE}</Dialog.Title>
                <Dialog.Content>
                    <View className="gap-y-4 pt-2">
                        <TextInput
                            label={CUSTOMERS_STRINGS.LABEL_NAME}
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                if (nameError) setNameError('');
                            }}
                            error={!!nameError}
                            errorText={nameError}
                        />

                        <TextInput
                            label={CUSTOMERS_STRINGS.LABEL_PHONE}
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (phoneError) setPhoneError('');
                            }}
                            keyboardType="phone-pad"
                            error={!!phoneError}
                            errorText={phoneError}
                        />

                        <TextInput
                            label={CUSTOMERS_STRINGS.LABEL_FLOUR}
                            value={flourAmount}
                            onChangeText={(text) => {
                                setFlourAmount(text);
                                if (flourError) setFlourError('');
                            }}
                            keyboardType="numeric"
                            error={!!flourError}
                            errorText={flourError}
                        />
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
