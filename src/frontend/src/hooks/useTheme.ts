import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'crypto-tracker-theme';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return (stored === 'dark' || stored === 'light') ? stored : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}
