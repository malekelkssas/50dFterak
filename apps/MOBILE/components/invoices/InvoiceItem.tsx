import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, Card } from '@mobile/components/ui';
import type { PlainInvoice } from '@mobile/backend';
import { Trash2, Edit2, Info } from 'lucide-react-native';
import { formatCurrency, formatTime } from '@mobile/utils/formatters';

interface InvoiceItemProps {
  invoice: PlainInvoice;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewDetails?: (invoice: PlainInvoice) => void;
}

export function InvoiceItem({
  invoice,
  onDelete,
  onEdit,
  onViewDetails,
}: InvoiceItemProps) {
  return (
    <Card className="mx-4 mb-3 p-4 active:opacity-80">
      <View className="flex-row items-start justify-between">
        {/* Left Side: Price & Actions */}
        <View className="items-start">
          <View className="bg-primary/10 mb-2 rounded-xl px-3 py-2">
            <Text variant="titleMedium" className="text-primary font-bold">
              {formatCurrency(invoice.price)}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center gap-1">
            {onDelete && (
              <Pressable
                onPress={() => onDelete(invoice._id)}
                className="rounded-full bg-red-50 p-2 dark:bg-red-900/20"
                hitSlop={10}
              >
                <Trash2 size={16} color="#ef4444" />
              </Pressable>
            )}
            {onEdit && (
              <Pressable
                onPress={() => onEdit(invoice._id)}
                className="rounded-full bg-blue-50 p-2 dark:bg-blue-900/20"
                hitSlop={10}
              >
                <Edit2 size={16} color="#3b82f6" />
              </Pressable>
            )}
            {onViewDetails && (
              <Pressable
                onPress={() => onViewDetails(invoice)}
                className="rounded-full bg-gray-100 p-2 dark:bg-gray-800"
                hitSlop={10}
              >
                <Info size={16} color="#6b7280" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Right Side: Texts aligned right */}
        <View className="ml-4 flex-1 items-end">
          <Text
            variant="titleMedium"
            className="mb-1 text-right font-bold"
            numberOfLines={1}
          >
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
          <View className="mt-1 w-full flex-row items-center justify-end gap-3">
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
