export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', locale: 'en-AE' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar (CAD)', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', locale: 'en-AU' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', locale: 'en-SG' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', locale: 'ja-JP' },
];

export function getCurrencyConfig(code: string = 'INR'): CurrencyConfig {
  return SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];
}

/**
 * Format a number cleanly without floating-point artifacts like 0.30000000000000004
 */
export function roundTo(num: number, decimals: number = 2): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Format currency with appropriate locale and symbol
 */
export function formatCurrency(
  amount: number | string,
  currencyCode: string = 'INR',
  options: { maximumFractionDigits?: number; compact?: boolean } = {}
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || !isFinite(num)) return '—';

  const config = getCurrencyConfig(currencyCode);
  const maxDigits = options.maximumFractionDigits ?? (num % 1 === 0 ? 0 : 2);

  if (options.compact && Math.abs(num) >= 1000) {
    if (currencyCode === 'INR') {
      if (Math.abs(num) >= 10000000) {
        return `${config.symbol}${(num / 10000000).toFixed(2)} Cr`;
      }
      if (Math.abs(num) >= 100000) {
        return `${config.symbol}${(num / 100000).toFixed(2)} Lakh`;
      }
      return `${config.symbol}${(num / 1000).toFixed(1)}k`;
    }
    // International compact format
    try {
      const compactFmt = new Intl.NumberFormat(config.locale, {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
      });
      return `${config.symbol}${compactFmt.format(num)}`;
    } catch {
      return `${config.symbol}${num.toLocaleString()}`;
    }
  }

  try {
    const formatted = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDigits,
    }).format(num);
    return `${config.symbol}${formatted}`;
  } catch {
    return `${config.symbol}${num.toFixed(maxDigits)}`;
  }
}

/**
 * Format standard number with commas and precision
 */
export function formatNumber(
  val: number | string,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || !isFinite(num)) return '0';
  const cleanNum = roundTo(num, decimals);
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(cleanNum);
}

/**
 * Format percentage
 */
export function formatPercent(val: number | string, decimals: number = 2): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || !isFinite(num)) return '0%';
  return `${roundTo(num, decimals)}%`;
}

/**
 * Parse safe number from input
 */
export function safeNumber(val: any, fallback: number = 0): number {
  if (val === undefined || val === null || val === '') return fallback;
  const parsed = Number(val);
  return isNaN(parsed) || !isFinite(parsed) ? fallback : parsed;
}
