import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, Card } from '@/components/ui';
import type { PlainInvoice } from '@/backend';
import { Trash2, Edit2, Info } from 'lucide-react-native';

interface InvoiceItemProps {
    invoice: PlainInvoice;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onViewDetails?: (invoice: PlainInvoice) => void;
}

import { formatCurrency, formatTime } from '@/utils/formatters';

export function InvoiceItem({ invoice, onDelete, onEdit, onViewDetails }: InvoiceItemProps) {
    return (
        <Card className="mb-3 mx-4 p-4 active:opacity-80">
            <View className="flex-row justify-between items-start">

                {/* Left Side: Price & Actions */}
                <View className="items-start">
                    <View className="bg-primary/10 px-3 py-2 rounded-xl mb-2">
                        <Text variant="titleMedium" className="font-bold text-primary">
                            {formatCurrency(invoice.price)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1 mt-1">
                        {onDelete && (
                            <Pressable
                                onPress={() => onDelete(invoice._id)}
                                className="p-2 bg-red-50 dark:bg-red-900/20 rounded-full"
                                hitSlop={10}
                            >
                                <Trash2 size={16} color="#ef4444" />
                            </Pressable>
                        )}
                        {onEdit && (
                            <Pressable
                                onPress={() => onEdit(invoice._id)}
                                className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full"
                                hitSlop={10}
                            >
                                <Edit2 size={16} color="#3b82f6" />
                            </Pressable>
                        )}
                        {onViewDetails && (
                            <Pressable
                                onPress={() => onViewDetails(invoice)}
                                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
                                hitSlop={10}
                            >
                                <Info size={16} color="#6b7280" />
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* Right Side: Texts aligned right */}
                <View className="flex-1 ml-4 items-end">
                    <Text variant="titleMedium" className="font-bold mb-1 text-right" numberOfLines={1}>
                        {invoice.title}
                    </Text>
                    {!!invoice.description && (
                        <Text
                            variant="bodyMedium"
                            className="text-secondary mb-2 text-right"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {invoice.description}
                        </Text>
                    )}
                    <View className="flex-row justify-end items-center mt-1 w-full gap-3">
                        {!!invoice.quantity && invoice.quantity > 1 && (
                            <Text variant="labelSmall" className="text-secondary text-right">
                                الكمية: {invoice.quantity}
                            </Text>
                        )}
                        <Text variant="labelSmall" className="text-secondary text-right">
                            الوقت: {formatTime(invoice.createdAt)}
                        </Text>
                    </View>
                </View>

            </View>
        </Card>
    );
}
