import { useQuery } from '@tanstack/react-query';
import type { CryptoAsset } from './types';
import { getEffectiveRefreshInterval } from './cryptoRefreshInterval';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

interface CoinGeckoMarketData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
}

function mapCoinGeckoToCryptoAsset(coin: CoinGeckoMarketData): CryptoAsset {
    return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        total_volume: coin.total_volume,
        image: coin.image
    };
}

export function useCryptoMarketData(overrideIntervalMs?: number) {
    const refreshInterval = overrideIntervalMs ?? getEffectiveRefreshInterval();

    return useQuery<CryptoAsset[], Error>({
        queryKey: ['crypto-market-data'],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `${COINGECKO_API}/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch market data: ${response.status} ${response.statusText}`);
                }

                const coins: CoinGeckoMarketData[] = await response.json();
                
                // Filter out any coins without proper data and ensure we have exactly 50
                const validCoins = coins
                    .filter(coin => 
                        coin.market_cap_rank > 0 && 
                        coin.current_price !== null &&
                        coin.market_cap !== null
                    )
                    .sort((a, b) => a.market_cap_rank - b.market_cap_rank)
                    .slice(0, 50);
                
                return validCoins.map(mapCoinGeckoToCryptoAsset);
            } catch (error) {
                console.error('Failed to fetch crypto market data:', error);
                throw error;
            }
        },
        refetchInterval: refreshInterval,
        staleTime: Math.max(refreshInterval - 1000, 1000),
        retry: 2,
        retryDelay: 1000
    });
}
