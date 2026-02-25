import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Modal, Text, Button, TextInput } from '@/components/ui';
import { invoiceService, InvoiceUpdateData, Invoice } from '@/backend';

interface EditInvoiceModalProps {
    visible: boolean;
    onDismiss: () => void;
    invoice: Invoice | null;
    onSuccess: () => void;
}

export function EditInvoiceModal({ visible, onDismiss, invoice, onSuccess }: EditInvoiceModalProps) {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (invoice && visible) {
            setTitle(invoice.title);
            setPrice(invoice.price.toString());
            setDescription(invoice.description || '');
            setQuantity(invoice.quantity?.toString() || '1');
            setError(null);
        }
    }, [invoice, visible]);

    const handleSave = () => {
        if (!invoice) return;

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
            const data: InvoiceUpdateData = {
                title: title.trim(),
                price: parsedPrice,
                description: description.trim(),
                quantity: isNaN(parsedQuantity) ? 1 : parsedQuantity,
            };

            invoiceService.updateInvoice(invoice._id, data);
            onSuccess();
        } catch (e) {
            console.error('Failed to update invoice', e);
            setError('حدث خطأ أثناء تحديث الفاتورة');
        } finally {
            setLoading(false);
        }
    };

    if (!invoice) return null;

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
                        تعديل الفاتورة
                    </Text>

                    <Text variant="bodyMedium" className="text-secondary mb-6 text-center">
                        التاريخ: {new Date(invoice.year, invoice.month - 1, invoice.day).toLocaleDateString('ar-EG')}
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
                                حفظ التعديلات
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
