/**
 * Half-up rounding at `fractionDigits` (ties away from zero).
 * Prefer this over `Math.round(x * 10**n) / 10**n` so the intent is explicit and
 * negative amounts stay consistent with the same rule.
 */
export function roundHalfUp(value: number, fractionDigits: number): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** fractionDigits;
  const scaled = value * factor;
  if (scaled >= 0) {
    return Math.floor(scaled + 0.5) / factor;
  }
  return Math.ceil(scaled - 0.5) / factor;
}
