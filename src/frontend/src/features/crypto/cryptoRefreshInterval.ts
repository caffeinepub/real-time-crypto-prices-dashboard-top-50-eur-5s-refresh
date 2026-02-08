/**
 * Configuration helper for crypto market data refresh interval.
 * Reads VITE_CRYPTO_REFRESH_INTERVAL_MS environment variable and validates it.
 */

const DEFAULT_REFRESH_INTERVAL_MS = 300000; // 5 minutes
const MIN_REFRESH_INTERVAL_MS = 1000;

function getRefreshIntervalMs(): number {
  const envValue = import.meta.env.VITE_CRYPTO_REFRESH_INTERVAL_MS;

  // If not set, use default
  if (envValue === undefined || envValue === '') {
    return DEFAULT_REFRESH_INTERVAL_MS;
  }

  // Validate the value
  const parsed = Number(envValue);

  if (isNaN(parsed)) {
    throw new Error(
      `Invalid VITE_CRYPTO_REFRESH_INTERVAL_MS: "${envValue}" is not a valid number. ` +
      `Expected an integer in milliseconds (minimum ${MIN_REFRESH_INTERVAL_MS}ms).`
    );
  }

  if (!Number.isInteger(parsed)) {
    throw new Error(
      `Invalid VITE_CRYPTO_REFRESH_INTERVAL_MS: "${envValue}" is not an integer. ` +
      `Expected an integer in milliseconds (minimum ${MIN_REFRESH_INTERVAL_MS}ms).`
    );
  }

  if (parsed < MIN_REFRESH_INTERVAL_MS) {
    throw new Error(
      `Invalid VITE_CRYPTO_REFRESH_INTERVAL_MS: ${parsed}ms is below the minimum of ${MIN_REFRESH_INTERVAL_MS}ms. ` +
      `Please use a value of at least ${MIN_REFRESH_INTERVAL_MS}ms to avoid excessive API calls.`
    );
  }

  return parsed;
}

/**
 * Get the effective refresh interval in milliseconds.
 * Throws an error if VITE_CRYPTO_REFRESH_INTERVAL_MS is set but invalid.
 */
export function getEffectiveRefreshInterval(): number {
  return getRefreshIntervalMs();
}

/**
 * Get the effective refresh interval in seconds for display purposes.
 */
export function getEffectiveRefreshIntervalSeconds(): number {
  return getRefreshIntervalMs() / 1000;
}
