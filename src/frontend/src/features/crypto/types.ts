export interface CryptoAsset {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    price_change_percentage_24h: number;
    total_volume: number;
    image: string;
}

export interface CryptoMarketDataResponse {
    data: CryptoAsset[];
    error?: string;
}
