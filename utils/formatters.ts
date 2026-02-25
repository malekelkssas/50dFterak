/**
 * Format number as currency (Egyptian Pounds)
 */
export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('ar-EG') + ' ج.م';
};

/**
 * Manually format time to be safe across RN intl implementations (AM/PM)
 */
export const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const ampm = hours >= 12 ? 'م' : 'ص';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
};
