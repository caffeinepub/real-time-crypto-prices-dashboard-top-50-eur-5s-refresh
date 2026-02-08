import { CryptoDashboard } from './features/crypto/CryptoDashboard';
import { useBackendHealth } from './hooks/useQueries';
import { ThemeToggle } from './components/ThemeToggle';
import { Activity } from 'lucide-react';
import { useEffect } from 'react';

export default function App() {
    const { data: healthStatus, isError: healthError } = useBackendHealth();

    useEffect(() => {
        if (healthStatus) {
            console.log('Backend status:', healthStatus);
        }
        if (healthError) {
            console.warn('Backend health check failed - continuing with frontend-only mode');
        }
    }, [healthStatus, healthError]);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Crypto Tracker</h1>
                                <p className="text-sm text-muted-foreground">Real-time cryptocurrency prices</p>
                            </div>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main>
                <CryptoDashboard />
            </main>

            <footer className="border-t bg-card mt-12">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-sm text-muted-foreground">
                        © 2026. Built with ❤️ using{' '}
                        <a 
                            href="https://caffeine.ai" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground transition-colors"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
