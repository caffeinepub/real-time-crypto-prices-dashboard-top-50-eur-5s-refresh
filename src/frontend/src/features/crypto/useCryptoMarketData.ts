import { useQuery } from '@tanstack/react-query';
import type { CryptoAsset } from './types';

const COINPAPRIKA_API = 'https://api.coinpaprika.com/v1';
const API_KEY = import.meta.env.VITE_COINPAPRIKA_API_KEY;

interface CoinPaprikaQuote {
    price: number;
    volume_24h: number;
    market_cap: number;
    percent_change_24h: number;
}

interface CoinPaprikaTicker {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    quotes: {
        EUR: CoinPaprikaQuote;
    };
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3Ctext x="16" y="20" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';

function getCoinPaprikaImageUrl(coinId: string): string {
    // CoinPaprika provides coin images at this URL pattern
    return `https://static.coinpaprika.com/coin/${coinId}/logo.png`;
}

function mapCoinPaprikaToCryptoAsset(ticker: CoinPaprikaTicker): CryptoAsset {
    const eurQuote = ticker.quotes.EUR;
    
    return {
        id: ticker.id,
        symbol: ticker.symbol.toLowerCase(),
        name: ticker.name,
        current_price: eurQuote.price,
        market_cap: eurQuote.market_cap,
        market_cap_rank: ticker.rank,
        price_change_percentage_24h: eurQuote.percent_change_24h,
        total_volume: eurQuote.volume_24h,
        image: getCoinPaprikaImageUrl(ticker.id)
    };
}

export function useCryptoMarketData() {
    return useQuery<CryptoAsset[], Error>({
        queryKey: ['crypto-market-data'],
        queryFn: async () => {
            // Validate API key at runtime
            if (!API_KEY || API_KEY.trim() === '') {
                throw new Error(
                    'CoinPaprika API key is required. Please set VITE_COINPAPRIKA_API_KEY in your .env file. ' +
                    'Get your API key at https://coinpaprika.com/api'
                );
            }

            try {
                const headers: HeadersInit = {
                    'Authorization': `${API_KEY}`
                };

                const response = await fetch(
                    `${COINPAPRIKA_API}/tickers?quotes=EUR`,
                    { headers }
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Invalid CoinPaprika API key. Please check your VITE_COINPAPRIKA_API_KEY.');
                    }
                    throw new Error(`CoinPaprika API request failed: ${response.status} ${response.statusText}`);
                }

                const tickers: CoinPaprikaTicker[] = await response.json();
                
                // Filter and sort by rank, take top 50
                const top50 = tickers
                    .filter(ticker => ticker.rank > 0 && ticker.quotes?.EUR)
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 50);
                
                console.log('CoinPaprika market data fetched successfully:', top50.length, 'assets');
                
                return top50.map(mapCoinPaprikaToCryptoAsset);
            } catch (error) {
                console.error('Failed to fetch crypto market data from CoinPaprika:', error);
                throw error;
            }
        },
        refetchInterval: 5000, // Refresh every 5 seconds
        staleTime: 4000,
        retry: 2,
        retryDelay: 1000
    });
}
