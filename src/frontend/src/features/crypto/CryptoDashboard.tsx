import { useCryptoMarketData } from './useCryptoMarketData';
import { TrendingUp, TrendingDown, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function CryptoDashboard() {
    const { data: cryptoData, isLoading, isError, error } = useCryptoMarketData();

    if (isError) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load market data</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error ? error.message : 'Unable to fetch cryptocurrency data. Please try again later.'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-3xl font-bold">Crypto Market Dashboard</CardTitle>
                            <CardDescription className="mt-2">
                                Top 50 cryptocurrencies by market cap • Prices in EUR • Auto-refresh every 5s
                            </CardDescription>
                        </div>
                        {isLoading && (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
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
                                                        src={asset.image} 
                                                        alt={asset.name}
                                                        className="h-8 w-8 rounded-full"
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
                                                €{asset.current_price.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: asset.current_price < 1 ? 6 : 2
                                                })}
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
                                                €{(asset.market_cap / 1_000_000_000).toFixed(2)}B
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                €{(asset.total_volume / 1_000_000).toFixed(2)}M
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
                </CardContent>
            </Card>
        </div>
    );
}
