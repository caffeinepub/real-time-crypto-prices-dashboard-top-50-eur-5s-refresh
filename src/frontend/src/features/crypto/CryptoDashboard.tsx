import { useCryptoMarketData } from './useCryptoMarketData';
import { getEffectiveRefreshIntervalSeconds } from './cryptoRefreshInterval';
import { RefreshIntervalSelector } from './RefreshIntervalSelector';
import { CryptoPricesList } from './CryptoPricesList';
import { formatEurPrice, formatMarketCap, formatVolume } from './formatters';
import { TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"%3E%3Ccircle cx="16" cy="16" r="16" fill="%23e5e7eb"/%3E%3Ctext x="16" y="20" font-family="Arial" font-size="14" fill="%239ca3af" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';

export function CryptoDashboard() {
    const [selectedIntervalMs, setSelectedIntervalMs] = useState<number | null>(null);
    const { data: cryptoData, isLoading, isError, error } = useCryptoMarketData(selectedIntervalMs ?? undefined);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    
    const effectiveIntervalSeconds = selectedIntervalMs 
        ? selectedIntervalMs / 1000 
        : getEffectiveRefreshIntervalSeconds();

    const handleImageError = (assetId: string) => {
        setImageErrors(prev => new Set(prev).add(assetId));
    };

    if (isError) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load market data</AlertTitle>
                    <AlertDescription>
                        Unable to fetch cryptocurrency data. Please check your internet connection and try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle className="text-3xl font-bold">Crypto Market Dashboard</CardTitle>
                            <CardDescription className="mt-2">
                                Top 50 cryptocurrencies by market cap • Prices in EUR • Auto-refresh every {effectiveIntervalSeconds}s
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <RefreshIntervalSelector 
                                value={selectedIntervalMs}
                                onChange={setSelectedIntervalMs}
                            />
                            {isLoading && (
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="prices">Prices</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="mt-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16">#</TableHead>
                                            <TableHead>Asset</TableHead>
                                            <TableHead className="text-right">Price (EUR)</TableHead>
                                            <TableHead className="text-right">24h Change</TableHead>
                                            <TableHead className="text-right">Market Cap</TableHead>
                                            <TableHead className="text-right">Volume (24h)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoading ? (
                                            Array.from({ length: 10 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32 ml-auto" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-28 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : cryptoData && cryptoData.length > 0 ? (
                                            cryptoData.map((asset) => (
                                                <TableRow key={asset.id}>
                                                    <TableCell className="font-medium">{asset.market_cap_rank}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <img 
                                                                src={imageErrors.has(asset.id) ? PLACEHOLDER_IMAGE : asset.image}
                                                                alt={asset.name}
                                                                className="h-8 w-8 rounded-full"
                                                                onError={() => handleImageError(asset.id)}
                                                            />
                                                            <div>
                                                                <div className="font-semibold">{asset.name}</div>
                                                                <div className="text-sm text-muted-foreground uppercase">
                                                                    {asset.symbol}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {formatEurPrice(asset.current_price)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge 
                                                            variant={asset.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}
                                                            className="gap-1"
                                                        >
                                                            {asset.price_change_percentage_24h >= 0 ? (
                                                                <TrendingUp className="h-3 w-3" />
                                                            ) : (
                                                                <TrendingDown className="h-3 w-3" />
                                                            )}
                                                            {Math.abs(asset.price_change_percentage_24h).toFixed(2)}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {formatMarketCap(asset.market_cap)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {formatVolume(asset.total_volume)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    No data available
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="prices" className="mt-0">
                            <CryptoPricesList data={cryptoData} isLoading={isLoading} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
