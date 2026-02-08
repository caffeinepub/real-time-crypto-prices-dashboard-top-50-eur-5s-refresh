/**
 * Formats a price in EUR with appropriate decimal places
 * @param price - The price to format
 * @returns Formatted price string with € symbol
 */
export function formatEurPrice(price: number): string {
    return `€${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: price < 1 ? 6 : 2
    })}`;
}

/**
 * Formats market cap in billions
 * @param marketCap - Market cap value
 * @returns Formatted string with B suffix
 */
export function formatMarketCap(marketCap: number): string {
    return `€${(marketCap / 1_000_000_000).toFixed(2)}B`;
}

/**
 * Formats volume in millions
 * @param volume - Volume value
 * @returns Formatted string with M suffix
 */
export function formatVolume(volume: number): string {
    return `€${(volume / 1_000_000).toFixed(2)}M`;
}
