import React, { useCallback, useEffect, useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft } from 'lucide-react-native';

import { Text, Button, TextInput, Snackbar } from '@/components/ui';
import { orgSettingsService } from '@/backend/services/OrgSettingsService';
import type { AppNavigationProp } from '@/utils/types';
import {
  SCHEME_DARK,
  PRICING_STRINGS,
  CUSTOMERS_STRINGS,
} from '@/utils/constants';

const copy = PRICING_STRINGS.ar;

function parsePriceInput(
  raw: string,
): { ok: true; value: number } | { ok: false } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { ok: false };
  const parts = trimmed.split('.');
  if (parts.length > 2) return { ok: false };
  if (parts[1] !== undefined && parts[1].length > 2) return { ok: false };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n <= 0) return { ok: false };
  return { ok: true, value: n };
}

export function GlobalFlourPriceScreen() {
  const navigation = useNavigation<AppNavigationProp<'GlobalFlourPrice'>>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === SCHEME_DARK;
  const iconColor = isDark ? '#ffffff' : '#000000';

  const [input, setInput] = useState('');
  const [storedPrice, setStoredPrice] = useState<number | null>(null);
  const [showInvalid, setShowInvalid] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const loadPrice = useCallback(() => {
    try {
      const v = orgSettingsService.getGlobalPricePerKg();
      setStoredPrice(v);
      setInput(v > 0 ? String(v) : '');
    } catch {
      setSnackbarMessage(copy.saveFailedBody);
    }
  }, []);

  useEffect(() => {
    loadPrice();
  }, [loadPrice]);

  const showEmptyState =
    storedPrice !== null && storedPrice === 0 && input.trim() === '';

  const handleSave = () => {
    setShowInvalid(false);
    const parsed = parsePriceInput(input);
    if (!parsed.ok) {
      setShowInvalid(true);
      return;
    }
    try {
      orgSettingsService.setGlobalPricePerKg(parsed.value);
      setStoredPrice(parsed.value);
      navigation.goBack();
    } catch {
      setSnackbarMessage(`${copy.saveFailedTitle}: ${copy.saveFailedBody}`);
    }
  };

  return (
    <View className="bg-background flex-1">
      <View className="border-border bg-surface z-10 flex-row items-center border-b p-4">
        <Pressable
          onPress={() => navigation.goBack()}
          className="-ml-2 min-h-12 min-w-12 items-center justify-center p-2"
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ChevronLeft size={24} color={iconColor} />
        </Pressable>
        <Text
          variant="titleLarge"
          className="ml-4 flex-1 font-semibold"
          accessibilityRole="header"
        >
          {copy.screenTitle}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {showEmptyState && (
          <View className="mb-6">
            <Text variant="headlineSmall" className="mb-2 font-semibold">
              {copy.emptyHeading}
            </Text>
            <Text variant="bodyLarge" className="text-muted-foreground">
              {copy.emptyBody}
            </Text>
          </View>
        )}

        {showInvalid && (
          <View className="mb-3">
            <Text
              variant="titleSmall"
              className="mb-1 font-semibold text-red-500"
            >
              {copy.invalidPriceTitle}
            </Text>
            <Text variant="bodyMedium" className="text-red-500">
              {copy.invalidPriceBody}
            </Text>
          </View>
        )}

        <View className="mb-4 flex-row items-end gap-2">
          <View className="min-w-0 flex-1">
            <TextInput
              label={copy.rateLabel}
              value={input}
              onChangeText={(t) => {
                setInput(t);
                setShowInvalid(false);
              }}
              keyboardType="decimal-pad"
              error={showInvalid}
              accessibilityLabel={copy.rateLabel}
            />
          </View>
          <Text variant="bodyLarge" className="text-muted-foreground mb-4">
            {CUSTOMERS_STRINGS.KILO_UNIT}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          className="mt-2"
          accessibilityLabel={`${PRICING_STRINGS.en.primaryCta}, ${copy.primaryCta}`}
        >
          {PRICING_STRINGS.en.primaryCta}
        </Button>
      </ScrollView>

      <Snackbar
        visible={!!snackbarMessage}
        onDismiss={() => setSnackbarMessage('')}
        duration={4000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
