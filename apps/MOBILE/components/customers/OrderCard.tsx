import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import {
  Text,
  ToggleButton,
  Dialog,
  Portal,
  Button,
} from '@mobile/components/ui';
import { Check, Clock, UserCircle, Trash2 } from 'lucide-react-native';
import {
  CUSTOMERS_STRINGS,
  SCREENS,
  ORDER_MONEY_STRINGS,
} from '@mobile/utils/constants';
import { formatSnapshotMoney } from '@mobile/utils/formatters';
import type { PlainOrder } from '@mobile/backend/realmHelpers';
import { useNavigation } from '@react-navigation/native';
import type { AppNavigationProp } from '@mobile/utils/types';

interface OrderCardProps {
  item: PlainOrder;
  showUserInfo?: boolean;
  onToggleStatus: (orderId: string) => void;
  onDelete: (orderId: string) => void;
}

export function OrderCard({
  item,
  showUserInfo = false,
  onToggleStatus,
  onDelete,
}: OrderCardProps) {
  const navigation = useNavigation<AppNavigationProp<'MainTabs'>>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUndoDialogOpen, setIsUndoDialogOpen] = useState(false);

  const isDone = !!item.doneAt;

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    onDelete(item._id);
  };

  const handleToggle = () => {
    if (isDone) {
      // Undoing a completed order — ask for confirmation
      setIsUndoDialogOpen(true);
    } else {
      // Marking as done — no confirmation needed
      onToggleStatus(item._id);
    }
  };

  const confirmUndo = () => {
    setIsUndoDialogOpen(false);
    onToggleStatus(item._id);
  };

  const handlePressUser = () => {
    if (showUserInfo && item.user) {
      navigation.navigate(SCREENS.USER_DETAILS, { userId: item.user._id });
    }
  };

  return (
    <>
      <Pressable
        className="bg-surface border-border/50 elevation-2 mb-3 rounded-xl border p-4 shadow-sm"
        onPress={handlePressUser}
        disabled={!showUserInfo}
      >
        {/* User Info Header (Optional) */}
        {showUserInfo && item.user && (
          <View className="border-border/50 mb-3 flex-row items-center border-b pb-3">
            <UserCircle size={32} color="#9ca3af" />
            <View className="ml-2 flex-1">
              <Text variant="titleMedium" className="text-foreground font-bold">
                {item.user.name || CUSTOMERS_STRINGS.NO_NAME_FALLBACK}
              </Text>
              <Text variant="bodySmall" className="text-muted-foreground">
                {item.user.phoneNumber}
              </Text>
            </View>
            <View className="items-end">
              <Text
                variant="labelSmall"
                className="text-muted-foreground mb-0.5"
              >
                {CUSTOMERS_STRINGS.BALANCE_LABEL}
              </Text>
              <Text
                variant="titleSmall"
                className={`font-bold ${item.user.flourAmount < 0 ? 'text-red-500' : 'text-primary'}`}
              >
                {item.user.flourAmount} {CUSTOMERS_STRINGS.KILO_UNIT}
              </Text>
            </View>
          </View>
        )}

        {/* Order Details */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center gap-2">
              <Text
                variant="titleMedium"
                className="text-foreground pt-1 font-bold"
              >
                {item.flourAmount} {CUSTOMERS_STRINGS.KILO_UNIT}
              </Text>
              {/* Delete Button */}
              <Pressable
                onPress={() => setIsDeleteDialogOpen(true)}
                className="rounded-full bg-red-500/10 p-1.5"
                hitSlop={8}
              >
                <Trash2 size={16} color="#ef4444" />
              </Pressable>
            </View>

            <Text variant="bodySmall" className="text-muted-foreground">
              {item.createdAt.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              {!showUserInfo &&
                `- ${item.createdAt.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}`}
            </Text>

            <View className="mt-2 flex-row flex-wrap gap-x-6 gap-y-2">
              <View>
                <Text
                  variant="labelSmall"
                  className="text-muted-foreground mb-0.5"
                >
                  {ORDER_MONEY_STRINGS.ar.snapshotTotalLabel}
                </Text>
                <Text
                  variant="bodyMedium"
                  className="text-foreground font-medium"
                  accessibilityLabel={`Snapshot total ${formatSnapshotMoney(item.snapshotTotal)}`}
                >
                  {formatSnapshotMoney(item.snapshotTotal)}
                </Text>
              </View>
              <View>
                <Text
                  variant="labelSmall"
                  className="text-muted-foreground mb-0.5"
                >
                  {ORDER_MONEY_STRINGS.ar.snapshotRateLabel}{' '}
                  {CUSTOMERS_STRINGS.KILO_UNIT}
                </Text>
                <Text
                  variant="bodyMedium"
                  className="text-foreground font-medium"
                  accessibilityLabel={`Snapshot price per kg ${formatSnapshotMoney(item.snapshotPricePerKg)}`}
                >
                  {formatSnapshotMoney(item.snapshotPricePerKg)}
                </Text>
              </View>
            </View>

            {isDone && item.doneAt && (
              <Text variant="bodySmall" className="mt-0.5 text-emerald-500">
                ✓ مكتمل{' '}
                {item.doneAt.toLocaleTimeString('ar-EG', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
          </View>

          <ToggleButton
            value={item._id}
            status={isDone ? 'checked' : 'unchecked'}
            onPress={handleToggle}
            icon={
              isDone ? (
                <Check size={20} color="#10b981" />
              ) : (
                <Clock size={20} color="#f59e0b" />
              )
            }
            className={`border ${isDone ? 'border-emerald-500/30' : 'border-amber-500/30'}`}
          />
        </View>
      </Pressable>

      <Portal>
        <Dialog
          visible={isDeleteDialogOpen}
          onDismiss={() => setIsDeleteDialogOpen(false)}
        >
          <Dialog.Title>
            {CUSTOMERS_STRINGS.DIALOG_DELETE_ORDER_TITLE}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {CUSTOMERS_STRINGS.DIALOG_DELETE_ORDER_DESC}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setIsDeleteDialogOpen(false)}>
              {CUSTOMERS_STRINGS.BTN_CANCEL}
            </Button>
            <Button
              mode="text"
              labelClassName="text-red-500"
              onPress={handleDelete}
            >
              {CUSTOMERS_STRINGS.BTN_DELETE}
            </Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={isUndoDialogOpen}
          onDismiss={() => setIsUndoDialogOpen(false)}
        >
          <Dialog.Title>تأكيد التراجع</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              هل أنت متأكد من التراجع عن إتمام هذا الطلب؟
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button mode="text" onPress={() => setIsUndoDialogOpen(false)}>
              {CUSTOMERS_STRINGS.BTN_CANCEL}
            </Button>
            <Button
              mode="text"
              labelClassName="text-amber-500"
              onPress={confirmUndo}
            >
              تراجع
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
