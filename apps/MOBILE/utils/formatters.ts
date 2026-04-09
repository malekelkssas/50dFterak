/**
 * Format number as currency (Egyptian Pounds)
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ar-EG') + ' ج.م';
};

/** Snapshot order money: fixed 2 decimals, ar-EG grouping, same ج.م suffix as formatCurrency. */
export const formatSnapshotMoney = (value: number): string => {
  return (
    value.toLocaleString('ar-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ج.م'
  );
};

/**
 * Manually format time to be safe across RN intl implementations (AM/PM)
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const ampm = hours >= 12 ? 'م' : 'ص';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};
