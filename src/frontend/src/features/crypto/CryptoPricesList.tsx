import { CryptoAsset } from './types';
import { formatEurPrice } from './formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3Ctext x="16" y="20" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';

interface CryptoPricesListProps {
    data: CryptoAsset[] | undefined;
    isLoading: boolean;
}

export function CryptoPricesList({ data, isLoading }: CryptoPricesListProps) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const handleImageError = (assetId: string) => {
        setImageErrors(prev => new Set(prev).add(assetId));
    };

    if (isLoading) {
        return (
            <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {data.map((asset) => (
                <div 
                    key={asset.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                    <div className="text-sm font-medium text-muted-foreground w-8 text-center">
                        #{asset.market_cap_rank}
                    </div>
                    <img 
                        src={imageErrors.has(asset.id) ? PLACEHOLDER_IMAGE : asset.image}
                        alt={asset.name}
                        className="h-10 w-10 rounded-full"
                        onError={() => handleImageError(asset.id)}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-base truncate">{asset.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">
                            {asset.symbol}
                        </div>
                    </div>
                    <div className="text-right font-mono font-semibold text-lg">
                        {formatEurPrice(asset.current_price)}
                    </div>
                </div>
            ))}
        </div>
    );
}
