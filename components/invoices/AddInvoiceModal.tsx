import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Modal, Text, Button, TextInput } from '@/components/ui';
import { invoiceService, InvoiceData } from '@/backend';

interface AddInvoiceModalProps {
    visible: boolean;
    onDismiss: () => void;
    currentDate: Date;
    onSuccess: () => void;
}

export function AddInvoiceModal({ visible, onDismiss, currentDate, onSuccess }: AddInvoiceModalProps) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = () => {
        if (!title.trim()) {
            setError('الرجاء إدخال عنوان الفاتورة');
            return;
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setError('الرجاء إدخال سعر صحيح');
            return;
        }

        const parsedQuantity = parseInt(quantity, 10);

        setError(null);
        setLoading(true);

        try {
            const data: InvoiceData = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth() + 1,
                day: currentDate.getDate(),
                title: title.trim(),
                price: parsedPrice,
                description: description.trim() || undefined,
                quantity: isNaN(parsedQuantity) ? 1 : parsedQuantity,
            };

            invoiceService.addInvoice(data);

            // Reset form
            setTitle('');
            setPrice('');
            setDescription('');
            setQuantity('1');

            onSuccess();
        } catch (e) {
            console.error('Failed to save invoice', e);
            setError('حدث خطأ أثناء حفظ الفاتورة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            onDismiss={onDismiss}
            contentContainerStyle={{ marginHorizontal: 16 }}
            className="z-50"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg elevation-5 mx-4 border border-border">
                    <Text variant="headlineSmall" className="font-bold mb-4 text-center">
                        إضافة فاتورة جديدة
                    </Text>

                    <Text variant="bodyMedium" className="text-secondary mb-6 text-center">
                        التاريخ: {currentDate.toLocaleDateString('ar-EG')}
                    </Text>

                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        {error && (
                            <Text className="text-red-500 mb-4 text-center">{error}</Text>
                        )}

                        <TextInput
                            label="عنوان الفاتورة *"
                            value={title}
                            onChangeText={setTitle}
                            className="mb-4"
                            placeholder="مثال: فاتورة الكهرباء"
                        />

                        <View className="flex-row gap-4 mb-4">
                            <TextInput
                                label="السعر *"
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                className="flex-1"
                                placeholder="0.0"
                                right={<TextInput.Affix text="ج.م" />}
                            />

                            <TextInput
                                label="الكمية"
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="numeric"
                                className="flex-1"
                            />
                        </View>

                        <TextInput
                            label="الوصف (اختياري)"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={5}
                            className="mb-8 min-h-[100px]"
                        />

                        <View className="flex-row justify-end gap-3 mt-4">
                            <Button mode="text" onPress={onDismiss} disabled={loading}>
                                إلغاء
                            </Button>
                            <Button mode="contained" onPress={handleSave} loading={loading}>
                                حفظ
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
