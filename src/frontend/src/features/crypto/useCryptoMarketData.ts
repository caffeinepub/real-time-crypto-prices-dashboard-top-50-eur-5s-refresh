import { useQuery } from '@tanstack/react-query';
import type { CryptoAsset } from './types';

const COINCAP_API = 'https://api.coincap.io/v2';

interface CoinCapAsset {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    priceUsd: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    changePercent24Hr: string;
}

interface CoinCapResponse {
    data: CoinCapAsset[];
}

// EUR/USD exchange rate (approximate, could be fetched from another API if needed)
const USD_TO_EUR = 0.92;

function mapCoinCapToCryptoAsset(asset: CoinCapAsset): CryptoAsset {
    const priceUsd = parseFloat(asset.priceUsd);
    const marketCapUsd = parseFloat(asset.marketCapUsd);
    const volumeUsd = parseFloat(asset.volumeUsd24Hr);
    
    return {
        id: asset.id,
        symbol: asset.symbol.toLowerCase(),
        name: asset.name,
        current_price: priceUsd * USD_TO_EUR,
        market_cap: marketCapUsd * USD_TO_EUR,
        market_cap_rank: parseInt(asset.rank),
        price_change_percentage_24h: parseFloat(asset.changePercent24Hr),
        total_volume: volumeUsd * USD_TO_EUR,
        image: `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
    };
}

export function useCryptoMarketData() {
    return useQuery<CryptoAsset[], Error>({
        queryKey: ['crypto-market-data'],
        queryFn: async () => {
            try {
                const response = await fetch(
                    `${COINCAP_API}/assets?limit=50`
                );

                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }

                const result: CoinCapResponse = await response.json();
                
                console.log('Crypto market data fetched successfully:', result.data.length, 'assets');
                
                return result.data.map(mapCoinCapToCryptoAsset);
            } catch (error) {
                console.error('Failed to fetch crypto market data:', error);
                throw error;
            }
        },
        refetchInterval: 5000, // Refresh every 5 seconds
        staleTime: 4000,
        retry: 2,
        retryDelay: 1000
    });
}
